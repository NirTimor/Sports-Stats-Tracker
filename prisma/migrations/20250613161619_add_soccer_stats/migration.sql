-- CreateTable
CREATE TABLE "SoccerStats" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "homeGoals" INTEGER NOT NULL DEFAULT 0,
    "homePossession" INTEGER NOT NULL DEFAULT 50,
    "homeShots" INTEGER NOT NULL DEFAULT 0,
    "homeShotsOnTarget" INTEGER NOT NULL DEFAULT 0,
    "homeCorners" INTEGER NOT NULL DEFAULT 0,
    "homeFouls" INTEGER NOT NULL DEFAULT 0,
    "awayGoals" INTEGER NOT NULL DEFAULT 0,
    "awayPossession" INTEGER NOT NULL DEFAULT 50,
    "awayShots" INTEGER NOT NULL DEFAULT 0,
    "awayShotsOnTarget" INTEGER NOT NULL DEFAULT 0,
    "awayCorners" INTEGER NOT NULL DEFAULT 0,
    "awayFouls" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoccerStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SoccerStats_matchId_key" ON "SoccerStats"("matchId");

-- CreateIndex
CREATE INDEX "SoccerStats_matchId_idx" ON "SoccerStats"("matchId");

-- AddForeignKey
ALTER TABLE "SoccerStats" ADD CONSTRAINT "SoccerStats_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
