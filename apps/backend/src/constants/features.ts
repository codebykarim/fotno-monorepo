// Single source of truth lives in packages/lib/src/constants/features.ts.
// The backend is CJS but @workspace/lib is ESM ("type": "module"), so we
// can't require() through the package. Instead we load the raw .ts file
// directly — tsx resolves it at runtime, and the tsconfig "paths" alias
// handles type-checking.
//
// If you need to add/remove/rename a feature, edit:
//   packages/lib/src/constants/features.ts
//
export {
  FEATURE_KEYS,
  FEATURE_LABELS,
  DEFAULT_TIER_FEATURES,
  featureLabel,
} from "@workspace/lib/constants/features";

export type { FeatureKey } from "@workspace/lib/constants/features";
