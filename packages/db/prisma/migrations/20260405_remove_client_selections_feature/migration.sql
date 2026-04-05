-- Remove deprecated feature rows
DELETE FROM "tier_feature" WHERE "featureKey" = 'CLIENT_SELECTIONS';
DELETE FROM "tier_feature" WHERE "featureKey" = 'BULK_UPLOAD_RETRY';
