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

router.post("/expenses", async (req, res) => {
  const { amount, description, category, isEarning } = req.body;

  const expense = await prisma.expenses.create({
    data: {
      amount: parseFloat(amount),
      description,
      isEarning,
      category: {
        connect: {
          id: parseInt(category),
        },
      },
    },
  });

  res.json(expense);
});

router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany();

  res.json(categories);
});

export default router;
