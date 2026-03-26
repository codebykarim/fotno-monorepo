-- Update existing subscriptions from LEMON_SQUEEZY to STRIPE
UPDATE "subscription" SET "source" = 'STRIPE' WHERE "source" = 'LEMON_SQUEEZY';
