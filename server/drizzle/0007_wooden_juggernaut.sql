CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'rejected');

ALTER TABLE "donors"
ALTER COLUMN "verify_status" DROP DEFAULT;

ALTER TABLE "donors"
ALTER COLUMN "verify_status"
SET DATA TYPE "public"."status"
USING (
  CASE
    WHEN "verify_status" = true THEN 'approved'::"public"."status"
    ELSE 'pending'::"public"."status"
  END
);

ALTER TABLE "donors"
ALTER COLUMN "verify_status"
SET DEFAULT 'pending';

DROP TYPE IF EXISTS "public"."verify_status";