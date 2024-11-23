-- CreateTable
CREATE TABLE "UserTypingData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalTypingTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kanaTypeTotalCount" INTEGER NOT NULL DEFAULT 0,
    "romaTypeTotalCount" INTEGER NOT NULL DEFAULT 0,
    "totalPlayCount" INTEGER NOT NULL DEFAULT 0,
    "maxCombo" INTEGER NOT NULL DEFAULT 0,
    "clapCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTypingData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTypingData_userId_key" ON "UserTypingData"("userId");

-- AddForeignKey
ALTER TABLE "UserTypingData" ADD CONSTRAINT "UserTypingData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
