#!/usr/bin/env bash
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────
FUNCTION_NAME="${LAMBDA_FUNCTION_NAME:-fotno-image-processor}"
ROLE_NAME="${FUNCTION_NAME}-role"
ECR_REPO_NAME="${FUNCTION_NAME}"
MEMORY_MB="${LAMBDA_MEMORY_MB:-2048}"
TIMEOUT_SEC="${LAMBDA_TIMEOUT_SEC:-120}"
ARCHITECTURE="arm64"

# These must be set in your environment
: "${AWS_REGION:?Set AWS_REGION}"
: "${AWS_S3_BUCKET:?Set AWS_S3_BUCKET}"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_URI="${ECR_URI}/${ECR_REPO_NAME}:latest"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Fotno Image Processor — Lambda Deployment              ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  Function:  ${FUNCTION_NAME}"
echo "║  Region:    ${AWS_REGION}"
echo "║  Bucket:    ${AWS_S3_BUCKET}"
echo "║  Memory:    ${MEMORY_MB}MB"
echo "║  Timeout:   ${TIMEOUT_SEC}s"
echo "║  Arch:      ${ARCHITECTURE}"
echo "║  Image:     ${IMAGE_URI}"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── 1. ECR Repository ────────────────────────────────────────────────
echo "→ Ensuring ECR repository exists..."
aws ecr describe-repositories --repository-names "${ECR_REPO_NAME}" --region "${AWS_REGION}" 2>/dev/null || \
  aws ecr create-repository \
    --repository-name "${ECR_REPO_NAME}" \
    --region "${AWS_REGION}" \
    --image-scanning-configuration scanOnPush=true \
    --image-tag-mutability MUTABLE

# ── 2. Build & Push Docker image ─────────────────────────────────────
echo "→ Logging into ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | \
  docker login --username AWS --password-stdin "${ECR_URI}"

echo "→ Building Lambda container image..."
docker build --platform linux/arm64 --provenance=false --sbom=false \
  -f "${SCRIPT_DIR}/Dockerfile.lambda" -t "${ECR_REPO_NAME}:latest" "${SCRIPT_DIR}"

echo "→ Tagging and pushing to ECR..."
docker tag "${ECR_REPO_NAME}:latest" "${IMAGE_URI}"
docker push "${IMAGE_URI}"

# ── 3. IAM Role ──────────────────────────────────────────────────────
ROLE_ARN=""
if aws iam get-role --role-name "${ROLE_NAME}" 2>/dev/null; then
  echo "→ IAM role ${ROLE_NAME} already exists"
  ROLE_ARN=$(aws iam get-role --role-name "${ROLE_NAME}" --query 'Role.Arn' --output text)
else
  echo "→ Creating IAM role ${ROLE_NAME}..."
  TRUST_POLICY='{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": { "Service": "lambda.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }]
  }'
  ROLE_ARN=$(aws iam create-role \
    --role-name "${ROLE_NAME}" \
    --assume-role-policy-document "${TRUST_POLICY}" \
    --query 'Role.Arn' --output text)

  # Attach basic Lambda execution (CloudWatch Logs)
  aws iam attach-role-policy \
    --role-name "${ROLE_NAME}" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

  echo "→ Waiting for role to propagate..."
  sleep 10
fi

# S3 access policy
S3_POLICY="{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Effect\": \"Allow\",
    \"Action\": [\"s3:GetObject\", \"s3:PutObject\"],
    \"Resource\": \"arn:aws:s3:::${AWS_S3_BUCKET}/*\"
  }]
}"
POLICY_NAME="${FUNCTION_NAME}-s3-access"
aws iam put-role-policy \
  --role-name "${ROLE_NAME}" \
  --policy-name "${POLICY_NAME}" \
  --policy-document "${S3_POLICY}"

# ── 4. Lambda Function ───────────────────────────────────────────────
ENV_VARS="{\"Variables\":{\"AWS_S3_BUCKET\":\"${AWS_S3_BUCKET}\",\"IMAGE_PROCESSOR_MAX_PIXELS\":\"${IMAGE_PROCESSOR_MAX_PIXELS:-100000000}\"}}"

if aws lambda get-function --function-name "${FUNCTION_NAME}" --region "${AWS_REGION}" 2>/dev/null; then
  echo "→ Updating Lambda function..."
  aws lambda update-function-code \
    --function-name "${FUNCTION_NAME}" \
    --image-uri "${IMAGE_URI}" \
    --region "${AWS_REGION}" \
    --architectures "${ARCHITECTURE}"

  # Wait for update to complete before changing configuration
  echo "→ Waiting for code update to complete..."
  aws lambda wait function-updated --function-name "${FUNCTION_NAME}" --region "${AWS_REGION}"

  aws lambda update-function-configuration \
    --function-name "${FUNCTION_NAME}" \
    --memory-size "${MEMORY_MB}" \
    --timeout "${TIMEOUT_SEC}" \
    --environment "${ENV_VARS}" \
    --region "${AWS_REGION}"
else
  echo "→ Creating Lambda function..."
  aws lambda create-function \
    --function-name "${FUNCTION_NAME}" \
    --package-type Image \
    --code "ImageUri=${IMAGE_URI}" \
    --role "${ROLE_ARN}" \
    --memory-size "${MEMORY_MB}" \
    --timeout "${TIMEOUT_SEC}" \
    --architectures "${ARCHITECTURE}" \
    --environment "${ENV_VARS}" \
    --region "${AWS_REGION}"

  echo "→ Waiting for function to become active..."
  aws lambda wait function-active --function-name "${FUNCTION_NAME}" --region "${AWS_REGION}"
fi

echo ""
echo "✅ Lambda function '${FUNCTION_NAME}' deployed successfully!"
echo ""
echo "Set these env vars on your image-processor service:"
echo "  IMAGE_PROCESSOR_LAMBDA_NAME=${FUNCTION_NAME}"
echo "  AWS_REGION=${AWS_REGION}"
echo ""
