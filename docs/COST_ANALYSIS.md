# Fotno — Full Cost & Expense Analysis (AWS S3)

> Created: 2026-03-20
> Purpose: Document all costs, margins, and scenarios to ensure zero-loss pricing across all tiers and regions.

---

## 1. Pricing Tiers

### USD (Global)

| Tier | Label | Storage | Price/month |
|------|-------|---------|-------------|
| Starter | Starter | 20 GB | $9.00 |
| Professional | Professional | 100 GB | $19.00 |
| Business | Business | 500 GB | $35.00 |
| Unlimited | Unlimited | 3 TB (internal cap, marketed as "Unlimited") | $49.00 |

### Egypt PPP (0.33x multiplier)

| Tier | Storage | Price/month (EGP) | USD equivalent |
|------|---------|-------------------|----------------|
| Starter | 20 GB | 150 EGP | ~$2.97 |
| Professional | 100 GB | 300 EGP | ~$6.27 |
| Business | 250 GB (reduced from 500 GB) | 550 EGP | ~$11.55 |
| Unlimited | **REMOVED** — no profitable price point exists | — | — |

---

## 2. Cost Components (Real Prices)

### A. AWS S3 (us-east-1, S3 Standard)

| Component | Price | Notes |
|-----------|-------|-------|
| **Storage** | **$0.023/GB/month** | First 50 TB |
| PUT/COPY/POST/LIST | $5.00 per million | 3 PUTs per photo upload |
| GET/SELECT | $0.40 per million | 2 GETs per photo view |
| **Egress to Internet** | **$0.09/GB** | After first 100 GB free (shared across ALL AWS services) |
| S3 → CloudFront | **FREE** | No charge for origin fetch |

### S3 Intelligent-Tiering (enabled)

| Access tier | Price | Auto-transition |
|-------------|-------|-----------------|
| Frequent | $0.023/GB | Default for new objects |
| Infrequent | $0.0125/GB | After 30 days without access |
| Archive Instant | $0.004/GB | After 90 days without access |
| Monitoring fee | $0.0025/1,000 objects | Monthly |

> ~70% of photos become "old" after 90 days. IT cuts storage costs by ~50% on aged data.

### B. AWS CloudFront Pro ($15/month)

| Included | Amount |
|----------|--------|
| Data transfer | 50 TB/month |
| Requests | 10 million/month |
| S3 → CloudFront | FREE |

> Eliminates all S3 egress costs. A single viral shared gallery without CloudFront could cost $60+.

### C. Lemon Squeezy Fees

| Scenario | Fee |
|----------|-----|
| Domestic (US) | 5% + $0.50 per transaction |
| International | 6.5% + $0.50 per transaction |
| Affiliate referral | +3% additional |
| Abandoned cart recovery | +5% additional |

### D. Server (Fixed)

| Item | Cost | Covers |
|------|------|--------|
| Server (Coolify) | $150/month | PostgreSQL, Redis, backend, workers |
| CloudFront Pro | $15/month | CDN for all photo delivery |
| **Total fixed** | **$165/month** | |

---

## 3. Per-Photo Cost

| Object | Size | S3 Storage/month | S3 PUT cost |
|--------|------|-------------------|-------------|
| Original (JPEG avg) | ~5 MB | $0.000115 | $0.000005 |
| Preview (WebP) | ~0.8 MB | $0.0000184 | $0.000005 |
| Thumbnail (WebP) | ~0.15 MB | $0.00000345 | $0.000005 |
| **Total per JPEG photo** | **~6 MB** | **$0.000138/month** | **$0.000015** |

| Object | Size | S3 Storage/month |
|--------|------|-------------------|
| Original (RAW) | ~25 MB | $0.000575 |
| **Total per RAW photo** | **~26 MB** | **$0.000598/month** |

> RAW photos cost **4.3x more** to store than JPEGs.

---

## 4. Per-User Monthly Costs

### 4a. USD Domestic — 50% Storage Utilization

| | Starter $9 | Professional $19 | Business $35 | Unlimited $49 |
|---|---|---|---|---|
| Storage used | 10 GB | 50 GB | 250 GB | 1 TB |
| S3 storage | $0.23 | $1.15 | $5.75 | $23.00 |
| S3 requests | ~$0.01 | ~$0.03 | ~$0.10 | ~$0.20 |
| S3 egress | $0 (CloudFront) | $0 | $0 | $0 |
| LS fee | $0.95 | $1.45 | $2.25 | $2.95 |
| **Total variable** | **$1.19** | **$2.63** | **$8.10** | **$26.15** |
| **Contribution margin** | **$7.81 (86.8%)** | **$16.37 (86.2%)** | **$26.90 (76.9%)** | **$22.85 (46.6%)** |

### 4b. USD Domestic — 100% Storage (Worst Case, with Intelligent-Tiering)

| | Starter $9 | Professional $19 | Business $35 | Unlimited $49 |
|---|---|---|---|---|
| Storage used | 20 GB | 100 GB | 500 GB | 3 TB (cap) |
| S3 with IT* | $0.28 | $1.39 | $6.95 | $29.10 |
| LS fee | $0.95 | $1.45 | $2.25 | $2.95 |
| **Total variable** | **$1.23** | **$2.84** | **$9.20** | **$32.05** |
| **Margin** | **$7.77 (86.3%)** | **$16.16 (85.1%)** | **$25.80 (73.7%)** | **$16.95 (34.6%)** |

*IT = 30% data at $0.023/GB (recent) + 70% at $0.004/GB (>90 days old)

### 4c. USD International — 100% Storage (Worst Case)

| | Starter $9 | Professional $19 | Business $35 | Unlimited $49 |
|---|---|---|---|---|
| S3 with IT | $0.28 | $1.39 | $6.95 | $29.10 |
| LS fee (6.5%+$0.50) | $1.09 | $1.74 | $2.78 | $3.69 |
| **Total variable** | **$1.37** | **$3.13** | **$9.73** | **$32.79** |
| **Margin** | **$7.63 (84.8%)** | **$15.87 (83.5%)** | **$25.27 (72.2%)** | **$16.21 (33.1%)** |

### 4d. Egypt PPP — 100% Storage (Worst Case)

| | Starter 150 EGP | Pro 300 EGP | Business 550 EGP |
|---|---|---|---|
| **USD revenue** | $2.97 | $6.27 | $11.55 |
| **Storage** | 20 GB | 100 GB | 250 GB |
| S3 with IT | $0.28 | $1.39 | $3.48 |
| LS fee (6.5%+$0.50) | $0.69 | $0.91 | $1.25 |
| **Total variable** | **$0.97** | **$2.30** | **$4.73** |
| **Margin** | **$2.00 (67.3%)** | **$3.97 (63.3%)** | **$6.82 (59.1%)** |

> Egypt Unlimited: REMOVED. No profitable price point exists (1TB costs $23 in S3 vs $16.17 max revenue).

---

## 5. LS Fee Impact by Tier

| Tier | Price | Domestic LS Fee | Effective Rate |
|------|-------|-----------------|----------------|
| Starter | $9.00 | $0.95 | **10.6%** |
| Professional | $19.00 | $1.45 | **7.6%** |
| Business | $35.00 | $2.25 | **6.4%** |
| Unlimited | $49.00 | $2.95 | **6.0%** |
| Egypt Starter | $2.97 | $0.69 | **23.2%** |
| Egypt Professional | $6.27 | $0.91 | **14.5%** |
| Egypt Business | $11.55 | $1.25 | **10.8%** |

> LS takes the biggest % on low-priced plans. At $2.97 Egypt Starter, the $0.50 flat fee alone is 16.8%.

---

## 6. Egress Analysis

### Without CloudFront (Risk Scenario)

| Users | Avg egress/user | Total | Free 100 GB | Billable | **S3 Bill** |
|-------|----------------|-------|-------------|----------|------------|
| 100 | 1 GB | 100 GB | -100 GB | 0 | $0 |
| 200 | 1 GB | 200 GB | -100 GB | 100 GB | **$9.00** |
| 500 | 1.5 GB | 750 GB | -100 GB | 650 GB | **$58.50** |
| 1,000 | 1.5 GB | 1.5 TB | -100 GB | 1.4 TB | **$126.00** |

Viral gallery (200 photos, 50K views): **$60.75 from ONE event**

### With CloudFront Pro ($15/month)

| Scenario | Cost |
|----------|------|
| Any traffic level up to 50 TB/month | **$15 flat** |
| Viral galleries | **$0 extra** |

---

## 7. Breakeven Analysis

### Fixed costs: $165/month (server $150 + CloudFront $15)

| User mix | Avg contribution/user | Users to breakeven |
|----------|----------------------|-------------------|
| All Starter | $7.81 | 22 users |
| All Professional | $16.37 | 11 users |
| **Realistic (40/30/20/10)** | **$15.43** | **11 users** |
| All Business | $26.90 | 7 users |

### Profit at Scale

| Paying users | Revenue | Total cost | **Monthly profit** |
|-------------|---------|------------|-------------------|
| 11 | $233 | $230 | $3 (breakeven) |
| 25 | $530 | $316 | **$214** |
| 50 | $1,060 | $482 | **$578** |
| 100 | $2,120 | $799 | **$1,321** |
| 250 | $5,300 | $1,708 | **$3,592** |
| 500 | $10,600 | $3,251* | **$7,349** |
| 1,000 | $21,200 | $6,502* | **$14,698** |

*Server upgrade at 500+ ($300) and 1000+ ($500)

---

## 8. Free Trial (14 Days)

| Item | Cost per trial user |
|------|---------------------|
| S3 storage (1 GB × 14 days) | $0.011 |
| S3 requests (200 uploads) | $0.001 |
| S3 egress (via CloudFront) | $0.00 |
| Server/AI (shared) | ~$0 |
| **Total** | **~$0.01** |

At 30% conversion: 70 churned users × $0.01 = **$0.70 sunk cost per 100 signups** (negligible).

---

## 9. Unlimited Tier Strategy

### What competitors do
- **Google Photos** — killed unlimited entirely (March 2026). Max 2TB at $9.99/month.
- **iCloud** — no unlimited. Max 12TB at $59.99/month.
- **SmugMug** — unlimited label, relies on median user storing little (heavy-tailed distribution).
- **Industry standard** — "Unlimited" with fair use policy. Internal soft caps. Throttle heavy users.

### Our approach
1. **Label:** "Unlimited" in UI and marketing
2. **Internal cap:** 3TB (in code, `UNLIMITED_BYTES`)
3. **S3 Intelligent-Tiering:** Auto-reduces cost on old photos
4. **At 3TB with IT:** Cost = $32.05, margin = $16.95 (34.6%)
5. **If user hits cap:** Upload processing slows (lower queue priority), admin alerted
6. **Fair use clause:** Add to Terms of Service
7. **Enterprise outreach:** Contact heavy users for custom plan

---

## 10. Egypt PPP Decision

### Why remove Egypt Unlimited
- Revenue: $16.17/month (800 EGP)
- Cost at 1TB: S3 $23 + LS $1.55 = $24.55
- **Loss: -$8.38/month per user**
- Even with IT at 500 GB: S3 ~$5 + LS $1.55 = $6.55, margin $9.62. But at 1TB+ it loses money.
- No price point works: 1100 EGP needed for breakeven at 1TB — too expensive for Egyptian market.

### Why reduce Egypt Business to 250 GB
- Old: 500 GB at 550 EGP ($11.55) → full storage cost $12.75 → **loss of $1.20**
- New: 250 GB at 550 EGP ($11.55) → full storage cost $4.73 → **margin $6.82 (59.1%)**
- 250 GB is still generous for the price

---

## 11. S3 Intelligent-Tiering Savings

| Scale | Storage | Without IT | With IT | Monthly Savings | Annual Savings |
|-------|---------|-----------|---------|-----------------|----------------|
| 100 users | ~5 TB | $115 | $49 | **$66** | **$792** |
| 250 users | ~12.5 TB | $287 | $121 | **$166** | **$1,992** |
| 500 users | ~25 TB | $575 | $242 | **$333** | **$3,996** |
| 1,000 users | ~50 TB | $1,150 | $484 | **$666** | **$7,992** |

---

## 12. Key Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Unlimited = 3TB internal cap | With IT, costs $32 at cap → 34.6% margin. Marketed as "Unlimited." |
| Egypt Unlimited removed | No profitable price point. $16.17 revenue vs $24.55+ cost. |
| Egypt Business = 250 GB | Old 500 GB lost money at full capacity. 250 GB has 59% margin. |
| CloudFront Pro mandatory | $15/month eliminates all egress risk. Without it, viral galleries = $60+ surprise bills. |
| S3 Intelligent-Tiering on | Saves 50%+ on storage for aged photos. $4K+/year at 500 users. |
| Prices ($9/19/35/49) are good | 73-87% margins on first 3 tiers. 34% margin on Unlimited at worst case. |

---

## Sources

- [AWS S3 Pricing](https://aws.amazon.com/s3/pricing/)
- [AWS CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/)
- [S3 Pricing Guide 2026](https://cloudchipr.com/blog/amazon-s3-pricing-explained)
- [Lemon Squeezy Fees](https://docs.lemonsqueezy.com/help/getting-started/fees)
- [Lemon Squeezy Pricing](https://www.lemonsqueezy.com/pricing)
- [Google Photos Kills Unlimited (March 2026)](https://9to5google.com/2026/03/16/google-photos-unlimited-storage-subscription-ends/)
- [SmugMug Unlimited Storage](https://www.smugmug.com/features/photo-storage/unlimited-photo-storage)
