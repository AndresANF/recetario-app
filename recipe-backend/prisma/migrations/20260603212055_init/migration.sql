-- CreateTable
CREATE TABLE "User" (
    "id_usuario" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id_receta" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id_receta")
);

-- CreateTable
CREATE TABLE "Group" (
    "id_grupo" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "_GroupToRecipe" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToRecipe_AB_unique" ON "_GroupToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToRecipe_B_index" ON "_GroupToRecipe"("B");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToRecipe" ADD CONSTRAINT "_GroupToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id_grupo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToRecipe" ADD CONSTRAINT "_GroupToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id_receta") ON DELETE CASCADE ON UPDATE CASCADE;
