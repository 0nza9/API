/*
  Warnings:

  - Added the required column `expiresAt` to the `AuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Avis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT NOT NULL,
    "email" TEXT,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "authorized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuthToken" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AuthToken" ("createdAt", "token", "userId") SELECT "createdAt", "token", "userId" FROM "AuthToken";
DROP TABLE "AuthToken";
ALTER TABLE "new_AuthToken" RENAME TO "AuthToken";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetToken" TEXT,
    "resetExpires" DATETIME
);
INSERT INTO "new_User" ("createdAt", "email", "id", "passwordHash", "resetExpires", "resetToken") SELECT "createdAt", "email", "id", "passwordHash", "resetExpires", "resetToken" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
