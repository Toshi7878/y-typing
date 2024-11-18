-- CreateTable
CREATE TABLE "TypingOption" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "timeOffset" INTEGER NOT NULL DEFAULT 0,
    "typeSound" BOOLEAN NOT NULL DEFAULT false,
    "missSound" BOOLEAN NOT NULL DEFAULT false,
    "lineClearSound" BOOLEAN NOT NULL DEFAULT false,
    "nextDisplay" TEXT NOT NULL,
    "timeOffsetKey" TEXT NOT NULL,
    "toggleInputModeKey" BOOLEAN NOT NULL,

    CONSTRAINT "TypingOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypingOption_userId_key" ON "TypingOption"("userId");

-- AddForeignKey
ALTER TABLE "TypingOption" ADD CONSTRAINT "TypingOption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
