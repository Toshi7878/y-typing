-- AlterTable
ALTER TABLE "TypingOption" ALTER COLUMN "timeOffset" SET DEFAULT 0,
ALTER COLUMN "timeOffset" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "nextDisplay" SET DEFAULT 'lyrics',
ALTER COLUMN "timeOffsetKey" SET DEFAULT 'left-right',
ALTER COLUMN "toggleInputModeKey" SET DEFAULT false;
