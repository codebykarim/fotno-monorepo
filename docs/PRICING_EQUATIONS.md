# Fotno Pricing Equations

> Use these formulas when adding a new tier, a new PPP country, or changing prices.
> All costs in USD. Last updated: 2026-03-20.

---

## Constants

```
S3_STANDARD        = $0.023/GB/month
S3_IT_BLENDED      = $0.0097/GB/month   (30% × $0.023 + 70% × $0.004, after 90 days)
S3_OPS_PER_PHOTO   ≈ $0.000015          (negligible, ignore for estimation)

LS_DOMESTIC_RATE    = 0.05               (5%)
LS_DOMESTIC_FLAT    = $0.50
LS_INTL_RATE        = 0.065              (6.5%)
LS_INTL_FLAT        = $0.50

FIXED_COST          = $165/month         (server $150 + CloudFront $15)
```

---

## 1. Variable Cost per User

```
Variable_Cost = S3_Cost + LS_Fee
```

### S3 Storage Cost

Without Intelligent-Tiering (new photos, < 90 days):
```
S3_Cost = storage_gb × 0.023
```

With Intelligent-Tiering (mature account, most photos > 90 days):
```
S3_Cost = storage_gb × 0.0097
```

For estimation, use the blended IT rate (`0.0097`) for "average" and standard rate (`0.023`) for "worst case."

### Lemon Squeezy Fee

Domestic (US buyer):
```
LS_Fee = (price × 0.05) + 0.50
```

International (non-US buyer):
```
LS_Fee = (price × 0.065) + 0.50
```

PPP country (price is already discounted):
```
PPP_Price = USD_price × pppMultiplier
LS_Fee    = (PPP_Price × 0.065) + 0.50       ← always international
```

---

## 2. Contribution Margin

```
Margin      = Revenue - Variable_Cost
Margin_%    = Margin / Revenue × 100
```

Example — Business tier ($35, 500 GB, IT blended, domestic):
```
S3_Cost  = 500 × 0.0097 = $4.85
LS_Fee   = (35 × 0.05) + 0.50 = $2.25
Variable = $4.85 + $2.25 = $7.10
Margin   = $35 - $7.10 = $27.90 (79.7%)
```

---

## 3. Adding a New Tier

### Find the minimum price for a tier to be profitable:

```
Min_Price = (S3_Cost + LS_FLAT) / (1 - LS_RATE)
```

Domestic:
```
Min_Price = (storage_gb × 0.0097 + 0.50) / (1 - 0.05)
Min_Price = (storage_gb × 0.0097 + 0.50) / 0.95
```

International:
```
Min_Price = (storage_gb × 0.0097 + 0.50) / (1 - 0.065)
Min_Price = (storage_gb × 0.0097 + 0.50) / 0.935
```

### With a target margin (e.g., 40%):

```
Price = Variable_Cost / (1 - target_margin)
Price = (storage_gb × 0.0097 + 0.50) / (0.95 × (1 - 0.40))     ← domestic
Price = (storage_gb × 0.0097 + 0.50) / (0.95 × 0.60)
```

### Quick reference table — minimum and 40% margin prices:

| Storage | S3 Cost (IT) | Min Price (intl) | Price @40% margin |
|---------|-------------|------------------|-------------------|
| 20 GB   | $0.19       | $0.74            | $1.24             |
| 50 GB   | $0.49       | $1.06            | $1.76             |
| 100 GB  | $0.97       | $1.57            | $2.62             |
| 250 GB  | $2.43       | $3.13            | $5.22             |
| 500 GB  | $4.85       | $5.72            | $9.54             |
| 1 TB    | $9.70       | $10.91           | $18.18            |
| 2 TB    | $19.40      | $21.28           | $35.47            |
| 3 TB    | $29.10      | $31.66           | $52.76            |

### Example — adding a 50 GB tier at $14:

```
S3_Cost  = 50 × 0.0097 = $0.49
LS_Fee   = (14 × 0.065) + 0.50 = $1.41        ← international worst case
Variable = $0.49 + $1.41 = $1.90
Margin   = $14 - $1.90 = $12.10 (86.4%)       ✅ Very profitable
```

---

## 4. Adding a New PPP Country

### Step 1: Choose a pppMultiplier

The multiplier is applied to USD prices. E.g., 0.33 = 33% of USD price.

### Step 2: Check EVERY tier for profitability

For each tier, compute:
```
PPP_Revenue  = USD_priceCents / 100 × pppMultiplier
S3_Cost      = storage_gb × 0.0097                      ← IT blended
LS_Fee       = (PPP_Revenue × 0.065) + 0.50             ← always intl
Variable     = S3_Cost + LS_Fee
Margin       = PPP_Revenue - Variable
```

**If Margin < 0 for any tier → either increase price, reduce storage, or exclude that tier.**

### Step 3: Find the maximum storage a PPP tier can offer

Solve for `max_storage_gb`:
```
PPP_Revenue > S3_Cost + LS_Fee
PPP_Revenue > (max_gb × 0.0097) + (PPP_Revenue × 0.065) + 0.50
PPP_Revenue × (1 - 0.065) - 0.50 > max_gb × 0.0097
max_gb < (PPP_Revenue × 0.935 - 0.50) / 0.0097
```

### Step 4: Find the minimum pppMultiplier for a tier

For a given tier (USD price + storage), find the lowest multiplier that's still profitable:
```
PPP_Revenue × 0.935 - 0.50 > storage_gb × 0.0097
PPP_Revenue > (storage_gb × 0.0097 + 0.50) / 0.935
USD_price × pppMultiplier > (storage_gb × 0.0097 + 0.50) / 0.935
pppMultiplier > (storage_gb × 0.0097 + 0.50) / (0.935 × USD_price)
```

### Example — adding India (INR) with pppMultiplier = 0.25:

| Tier | USD Price | PPP Revenue | S3 (IT) | LS Fee | Variable | Margin | OK? |
|------|-----------|-------------|---------|--------|----------|--------|-----|
| Starter 20GB | $9 | $2.25 | $0.19 | $0.65 | $0.84 | $1.41 (62.5%) | ✅ |
| Pro 100GB | $19 | $4.75 | $0.97 | $0.81 | $1.78 | $2.97 (62.5%) | ✅ |
| Business 500GB | $35 | $8.75 | $4.85 | $1.07 | $5.92 | $2.83 (32.4%) | ⚠️ Thin |
| Business 250GB | $35 | $8.75 | $2.43 | $1.07 | $3.50 | $5.25 (60.0%) | ✅ Better |
| Unlimited 3TB | $49 | $12.25 | $29.10 | $1.30 | $30.40 | -$18.15 | ❌ LOSS |

**Decision for India:** Starter ✅, Pro ✅, Business with 250GB override ✅, Unlimited ❌ remove.

### Reusable check for "should this country get Unlimited?":

```
Can_Offer_Unlimited = (USD_price_unlimited × pppMultiplier × 0.935 - 0.50) > (3000 × 0.0097)
Can_Offer_Unlimited = (49 × pppMultiplier × 0.935 - 0.50) > 29.10
49 × pppMultiplier × 0.935 > 29.60
pppMultiplier > 29.60 / (49 × 0.935)
pppMultiplier > 0.646
```

**Any country with pppMultiplier below 0.65 should NOT get the Unlimited tier.**

### Reusable check for "should this country get 500 GB Business?":

```
Can_Offer_500GB = (35 × pppMultiplier × 0.935 - 0.50) > (500 × 0.0097)
35 × pppMultiplier × 0.935 > 5.35
pppMultiplier > 5.35 / (35 × 0.935)
pppMultiplier > 0.163
```

**Any country with pppMultiplier above 0.17 can safely offer 500 GB Business.**

For countries between 0.17 and 0.65: offer Business (500 GB) but not Unlimited.
Below 0.17: consider reducing Business storage too.

---

## 5. Breakeven (Users Needed)

```
Breakeven_Users = FIXED_COST / Avg_Contribution_Margin
```

With a known user mix (e.g., 40% S, 30% P, 20% B, 10% U):
```
Avg_Margin = 0.40 × Margin_Starter + 0.30 × Margin_Pro + 0.20 × Margin_Business + 0.10 × Margin_Unlimited
Breakeven  = 165 / Avg_Margin
```

---

## 6. Monthly Profit at Scale

```
Monthly_Profit = Total_Revenue - Total_Variable_Cost - Fixed_Cost
Monthly_Profit = Σ(users_per_tier × price_per_tier) - Σ(users_per_tier × variable_cost_per_tier) - 165
```

Or simplified:
```
Monthly_Profit = Σ(users_per_tier × margin_per_tier) - Fixed_Cost
```

---

## 7. Quick Decision Cheatsheet

### "Can I offer tier X at price Y?"
```
Profitable? = Y > (storage_gb × 0.0097 + 0.50) / 0.935
```

### "What's my margin on this tier?"
```
Margin = Y - (storage_gb × 0.0097) - (Y × 0.065) - 0.50
Margin = Y × 0.935 - 0.50 - (storage_gb × 0.0097)
```

### "What's the max storage I can offer at price Y?"
```
Max_GB = (Y × 0.935 - 0.50) / 0.0097
```

### "What's the min price for Z GB storage?"
```
Min_Price = (Z × 0.0097 + 0.50) / 0.935
```

### "Should this PPP country get Unlimited?"
```
Yes if: pppMultiplier > 0.65
```

### "Should this PPP country get 500 GB Business?"
```
Yes if: pppMultiplier > 0.17
```

---

## 8. Worst-Case vs Average Scenarios

Always check both:

| Scenario | S3 Rate | Storage Used | Use When |
|----------|---------|-------------|----------|
| **Average** | $0.0097/GB (IT blended) | 50% of tier | Day-to-day planning |
| **Worst case** | $0.023/GB (all Standard) | 100% of tier | Setting prices, guaranteeing no loss |

**Rule: If worst case is profitable, you're safe. If only average is profitable, you're gambling.**

For tier pricing decisions, always use worst case ($0.023/GB at 100% utilization).
For business projections and revenue forecasts, use average ($0.0097/GB at 50%).
