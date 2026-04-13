// Re-export from the single source of truth in @workspace/lib.
// If you need to add/remove/rename a feature, edit ONLY:
//   packages/lib/src/constants/features.ts
export {
  FEATURE_KEYS,
  FEATURE_LABELS,
  DEFAULT_TIER_FEATURES,
  featureLabel,
} from "@workspace/lib";

export type { FeatureKey } from "@workspace/lib";
