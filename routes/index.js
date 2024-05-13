import { PrismaClient } from "@prisma/client";
import { Router } from "express";
const router = Router();

const prisma = new PrismaClient();

/* GET home page. */
router.get("/expenses", async (req, res) => {
  const expenses = await prisma.expenses.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(expenses);
});

router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany();

  res.json(categories);
});

export default router;
