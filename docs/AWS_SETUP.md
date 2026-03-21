# AWS Infrastructure Setup: S3 + Intelligent-Tiering + CloudFront

> Step-by-step guide to set up the full AWS stack for Fotno.
> Estimated time: ~30 minutes. Cost: $15/month (CloudFront Pro) + S3 usage.

---

## Overview

```
User → CloudFront (CDN, $15/month flat) → S3 Bucket (private, Intelligent-Tiering)
                                              ↑
                                      Upload Service (writes directly to S3)
```

- **S3**: Private bucket, all objects stored with `INTELLIGENT_TIERING` storage class
- **CloudFront**: Serves photos via signed URLs, zero S3 egress cost
- **OAC**: Origin Access Control keeps S3 private, only CloudFront can read

---

## Step 1: Create the S3 Bucket

### AWS Console

1. Go to **S3** → **Create bucket**
2. **Bucket name**: `fotno-photos` (or your preferred name)
3. **Region**: `us-east-1` (cheapest, best CloudFront integration)
4. **Object Ownership**: ACLs disabled (recommended)
5. **Block all public access**: ✅ ON (keep everything private)
6. **Bucket Versioning**: Disabled (saves storage cost — photos are immutable)
7. **Default encryption**: SSE-S3 (free, automatic)
8. Click **Create bucket**

### AWS CLI

```bash
aws s3api create-bucket \
  --bucket fotno-photos \
  --region us-east-1

# Block all public access
aws s3api put-public-access-block \
  --bucket fotno-photos \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

---

## Step 2: Enable S3 Intelligent-Tiering

Intelligent-Tiering automatically moves objects between tiers based on access patterns.
No retrieval fees. Objects move to cheaper storage when not accessed.

### What happens automatically:

| Tier | Price | When |
|------|-------|------|
| Frequent Access | $0.023/GB | Default (new uploads) |
| Infrequent Access | $0.0125/GB | After 30 days without access |
| Archive Instant Access | $0.004/GB | After 90 days without access |

Monitoring fee: $0.0025 per 1,000 objects/month (negligible).

### AWS Console

1. Go to **S3** → **fotno-photos** → **Properties** tab
2. Scroll to **Intelligent-Tiering Archive configurations**
3. Click **Create configuration**
4. **Configuration name**: `fotno-auto-archive`
5. **Filter scope**: Choose **Apply to all objects in the bucket**
6. **Archive Access tiers**:
   - ✅ **Archive Instant Access tier**: 90 days (recommended — no retrieval delay)
   - ❌ Skip "Archive Access tier" (180 days) — adds retrieval delay, not good for photos
   - ❌ Skip "Deep Archive Access tier" (730 days) — minutes to retrieve, bad UX
7. Click **Create configuration**

### AWS CLI

```bash
aws s3api put-bucket-intelligent-tiering-configuration \
  --bucket fotno-photos \
  --id fotno-auto-archive \
  --intelligent-tiering-configuration '{
    "Id": "fotno-auto-archive",
    "Status": "Enabled",
    "Tierings": [
      {
        "AccessTier": "ARCHIVE_INSTANT_ACCESS",
        "Days": 90
      }
    ]
  }'
```

### Important: Your code already handles this

The upload service already sets `StorageClass: 'INTELLIGENT_TIERING'` on every upload
(multipart uploads, thumbnails, previews, Google Drive imports, Google Photos imports).
The bucket configuration above enables the *archive tiers* — objects auto-move to cheaper
storage after 90 days without access.

---

## Step 3: Create CloudFront Key Pair (for Signed URLs)

CloudFront signed URLs require a public/private key pair. The private key stays on your
server; the public key is uploaded to CloudFront.

### Generate the key pair

Run these on your local machine (NOT on the server):

```bash
# Generate 2048-bit RSA private key
openssl genrsa -out fotno-cloudfront-private-key.pem 2048

# Extract public key
openssl rsa -pubout -in fotno-cloudfront-private-key.pem -out fotno-cloudfront-public-key.pem

# View the public key (you'll paste this into AWS)
cat fotno-cloudfront-public-key.pem
```

### Upload public key to CloudFront

#### AWS Console

1. Go to **CloudFront** → **Key management** → **Public keys**
2. Click **Create public key**
3. **Name**: `fotno-signing-key`
4. **Key value**: Paste the contents of `fotno-cloudfront-public-key.pem`
   (including the `-----BEGIN PUBLIC KEY-----` and `-----END PUBLIC KEY-----` lines)
5. Click **Create public key**
6. **Copy the Key ID** — you'll need this (looks like `K2ABCDEF123456`)

### Create a Key Group

1. Go to **CloudFront** → **Key management** → **Key groups**
2. Click **Create key group**
3. **Name**: `fotno-signing-group`
4. **Public keys**: Select `fotno-signing-key`
5. Click **Create key group**

### AWS CLI

```bash
# Upload public key
aws cloudfront create-public-key \
  --public-key-config '{
    "CallerReference": "fotno-key-2026",
    "Name": "fotno-signing-key",
    "EncodedKey": "'"$(cat fotno-cloudfront-public-key.pem)"'"
  }'

# Note the Id from the response (e.g., K2ABCDEF123456)
# Then create key group:
aws cloudfront create-key-group \
  --key-group-config '{
    "Name": "fotno-signing-group",
    "Items": ["K2ABCDEF123456"]
  }'
```

### Store the private key securely

```bash
# The private key content goes into your CLOUDFRONT_PRIVATE_KEY env var.
# You can base64 encode it for easier handling in env vars:
cat fotno-cloudfront-private-key.pem

# Store it with \n for newlines in a single-line env var:
# CLOUDFRONT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----"
```

**⚠️ Keep `fotno-cloudfront-private-key.pem` safe. Delete it from your machine after
copying to your deployment secrets. Never commit it to git.**

---

## Step 4: Create CloudFront Distribution

### AWS Console

1. Go to **CloudFront** → **Create distribution**

#### Origin Settings
2. **Origin domain**: Select your S3 bucket (`fotno-photos.s3.us-east-1.amazonaws.com`)
   - ⚠️ Pick the S3 bucket from the dropdown, NOT a website endpoint
3. **Origin access**: Choose **Origin access control settings (recommended)**
4. Click **Create new OAC**:
   - **Name**: `fotno-photos-oac`
   - **Signing protocol**: Sigv4
   - **Signing behavior**: Always sign
   - **Origin type**: S3
   - Click **Create**
5. **Origin path**: Leave empty

#### Default Cache Behavior
6. **Viewer protocol policy**: Redirect HTTP to HTTPS
7. **Allowed HTTP methods**: GET, HEAD
8. **Restrict viewer access**: **Yes**
   - **Trusted authorization type**: **Trusted key groups**
   - **Add key group**: Select `fotno-signing-group`
9. **Cache policy**: `CachingOptimized` (recommended for static content like photos)
   - This caches based on the object key — perfect for immutable photos
10. **Response headers policy**: `SimpleCORS` (if your frontend is on a different domain)

#### Distribution Settings
11. **Price class**: Use all edge locations (best for global users) or
    "Use only North America and Europe" (cheaper if users are mostly there)
12. **Default root object**: Leave empty (we don't serve index.html)
13. **Description**: `Fotno photo CDN`
14. Click **Create distribution**

#### After creation
15. **Copy the Distribution domain name** — looks like `d1234abcdef8.cloudfront.net`
    This is your `CLOUDFRONT_DOMAIN` env var.
16. AWS will show a yellow banner: **"S3 bucket policy needs to be updated"**
    Click **Copy policy** — you'll need this for the next step.

### AWS CLI

```bash
# Create OAC
aws cloudfront create-origin-access-control \
  --origin-access-control-config '{
    "Name": "fotno-photos-oac",
    "Description": "OAC for fotno photos bucket",
    "SigningProtocol": "sigv4",
    "SigningBehavior": "always",
    "OriginAccessControlOriginType": "s3"
  }'
# Note the Id from the response (e.g., E1ABCDEF234567)

# Create distribution (replace OAC ID and Key Group ID)
aws cloudfront create-distribution \
  --distribution-config '{
    "CallerReference": "fotno-2026",
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "fotno-s3",
          "DomainName": "fotno-photos.s3.us-east-1.amazonaws.com",
          "OriginAccessControlId": "E1ABCDEF234567",
          "S3OriginConfig": {
            "OriginAccessIdentity": ""
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "fotno-s3",
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      },
      "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
      "TrustedKeyGroups": {
        "Enabled": true,
        "Quantity": 1,
        "Items": ["YOUR_KEY_GROUP_ID"]
      }
    },
    "Enabled": true,
    "Comment": "Fotno photo CDN"
  }'
```

---

## Step 5: Update S3 Bucket Policy

CloudFront needs permission to read from your private S3 bucket.
AWS generates this policy for you — paste it into the bucket policy.

### AWS Console

1. Go to **S3** → **fotno-photos** → **Permissions** tab
2. Click **Edit** under **Bucket policy**
3. Paste this policy (replace the values from your CloudFront distribution):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::fotno-photos/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

4. Replace:
   - `fotno-photos` → your actual bucket name
   - `YOUR_ACCOUNT_ID` → your 12-digit AWS account ID
   - `YOUR_DISTRIBUTION_ID` → your CloudFront distribution ID (e.g., `E1A2B3C4D5E6F7`)
5. Click **Save changes**

---

## Step 6: Subscribe to CloudFront Pro Plan ($15/month)

The Pro plan gives you 50 TB transfer + 10M requests + WAF + DDoS protection.
Without it, you pay $0.085/GB for egress (expensive for a photo app).

### AWS Console

1. Go to **CloudFront** → Select your distribution
2. In the distribution settings, look for **Pricing plan** or **Plan**
3. Select **Pro ($15/month)**
4. Confirm the subscription

> If you don't see the flat-rate plan option, go to
> **AWS Billing** → **Pricing Plan Manager** → **CloudFront** and subscribe there.

### Alternative: Start with Pay-As-You-Go

If you have few users (< 100), the free tier (100 GB/month + 1M requests) might be enough.
Switch to Pro when your monthly transfer exceeds ~180 GB (where $15 flat < pay-as-you-go).

```
Breakeven: 180 GB × $0.085 = $15.30 → Pro plan is cheaper above 180 GB/month
At 50 users with 1 GB egress each = 50 GB → Free tier is fine
At 200 users = 200 GB → Pro plan saves money
```

---

## Step 7: Create IAM User for Your App

Your backend and upload service need AWS credentials to write to S3.

### AWS Console

1. Go to **IAM** → **Users** → **Create user**
2. **User name**: `fotno-app`
3. **Permissions**: Attach policy directly
4. Click **Create policy** and use this JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3PhotosBucket",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListMultipartUploadParts",
        "s3:AbortMultipartUpload",
        "s3:CreateMultipartUpload",
        "s3:CompleteMultipartUpload",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::fotno-photos",
        "arn:aws:s3:::fotno-photos/*"
      ]
    }
  ]
}
```

5. **Policy name**: `fotno-s3-access`
6. Attach this policy to the `fotno-app` user
7. Go to **Security credentials** tab → **Create access key**
8. Choose **Application running outside AWS**
9. **Copy the Access Key ID and Secret Access Key**

---

## Step 8: Set Environment Variables

Add these to your Coolify service environment variables:

### Backend Service

```env
# S3 (same as before, just remove R2-specific vars)
AWS_REGION=us-east-1
AWS_S3_BUCKET=fotno-photos
AWS_ACCESS_KEY_ID=AKIA...your-key...
AWS_SECRET_ACCESS_KEY=your-secret-key

# CloudFront (NEW)
CLOUDFRONT_DOMAIN=d1234abcdef8.cloudfront.net
CLOUDFRONT_KEY_PAIR_ID=K2ABCDEF123456
CLOUDFRONT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...your-private-key...\n-----END RSA PRIVATE KEY-----"
```

### Upload Service

```env
AWS_REGION=us-east-1
AWS_S3_BUCKET=fotno-photos
AWS_ACCESS_KEY_ID=AKIA...your-key...
AWS_SECRET_ACCESS_KEY=your-secret-key
# Remove: AWS_S3_ENDPOINT (no longer needed, was for R2)
# Remove: R2_ENDPOINT (no longer needed)

# CloudFront domain for storageUrl construction
CLOUDFRONT_DOMAIN=d1234abcdef8.cloudfront.net
```

### Variables to REMOVE (R2-specific)

```env
# Delete these from all services:
AWS_S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
```

---

## Step 9: Verify Everything Works

### Test S3 upload

```bash
# Upload a test file
echo "test" > /tmp/test.txt
aws s3 cp /tmp/test.txt s3://fotno-photos/test.txt --storage-class INTELLIGENT_TIERING

# Verify storage class
aws s3api head-object --bucket fotno-photos --key test.txt
# Should show: "StorageClass": "INTELLIGENT_TIERING"

# Clean up
aws s3 rm s3://fotno-photos/test.txt
```

### Test CloudFront access (should fail without signed URL)

```bash
# This should return 403 (bucket is private, requires signed URL)
curl -I https://d1234abcdef8.cloudfront.net/test.txt
# Expected: HTTP/2 403
```

### Test signed URL generation (from your app)

Once deployed, the backend's `getPresignedDownloadUrl()` will generate CloudFront signed
URLs like:
```
https://d1234abcdef8.cloudfront.net/previews/gallery123/photo456.webp?Expires=1711000000&Signature=abc...&Key-Pair-Id=K2ABCDEF123456
```

### Test Intelligent-Tiering monitoring

```bash
# After a few days, check tiering status of an object
aws s3api head-object --bucket fotno-photos --key originals/some-photo.jpg
# New objects: "StorageClass": "INTELLIGENT_TIERING"
# After 90 days: moves to Archive Instant Access automatically (no action needed)
```

---

## Step 10: Data Migration from R2 (if needed)

If you have existing data in Cloudflare R2:

```bash
# Option 1: Use rclone (recommended for large migrations)
# Install rclone, configure both remotes, then:
rclone sync r2:fotno-bucket s3:fotno-photos \
  --s3-storage-class INTELLIGENT_TIERING \
  --transfers 16 \
  --progress

# Option 2: Use AWS CLI with S3-compatible source
# Configure R2 as a custom endpoint profile
aws configure --profile r2
# Then sync:
aws s3 sync s3://fotno-bucket s3://fotno-photos \
  --source-region auto \
  --profile r2 \
  --storage-class INTELLIGENT_TIERING
```

---

## Summary Checklist

- [ ] S3 bucket created (`fotno-photos`, us-east-1, private)
- [ ] Intelligent-Tiering Archive config enabled (90-day Archive Instant)
- [ ] CloudFront key pair generated (private + public)
- [ ] Public key uploaded to CloudFront
- [ ] Key group created with the public key
- [ ] CloudFront distribution created with OAC + signed URLs (trusted key group)
- [ ] S3 bucket policy updated (allow CloudFront OAC)
- [ ] CloudFront Pro plan subscribed ($15/month) — or use free tier if < 200 users
- [ ] IAM user created with S3 permissions
- [ ] Environment variables set on all services (backend, upload-service)
- [ ] Old R2 env vars removed
- [ ] Tested: S3 upload works, CloudFront returns 403 without signed URL, signed URLs work
- [ ] Data migrated from R2 (if applicable)

---

## Cost After Setup

| Component | Monthly Cost |
|-----------|-------------|
| CloudFront Pro | $15.00 |
| S3 storage (scales with users) | $0.0097/GB blended |
| S3 requests | ~$0.005/1000 PUTs |
| S3 egress | $0.00 (CloudFront) |
| **Total fixed** | **$15.00** |

---

## Sources

- [AWS S3 Intelligent-Tiering Docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-intelligent-tiering.html)
- [CloudFront OAC Setup](https://repost.aws/knowledge-center/cloudfront-oac-origins)
- [CloudFront Signed URLs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html)
- [CloudFront Key Groups](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html)
- [CloudFront Flat-Rate Pricing](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html)
- [CloudFront Pricing Page](https://aws.amazon.com/cloudfront/pricing/)
- [S3 + CloudFront OAC Tutorial](https://opstree.com/blog/2026/02/17/secure-website-hosting-aws-s3-cloudfront-oac/)
- [CloudFront Signed URLs Guide](https://oneuptime.com/blog/post/2026-02-12-cloudfront-signed-urls-and-cookies/view)
