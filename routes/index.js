import { PrismaClient } from "@prisma/client";
import { Router } from "express";
const router = Router();

const prisma = new PrismaClient();

router.get("/expenses", async (req, res) => {
  const expenses = await prisma.expenses.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(expenses);
});

router.post("/expenses", async (req, res) => {
  const { dateFrom, dateTo } = req.body;

  const expenses = await prisma.expenses.findMany({
    where: {
      createdAt: {
        gte: new Date(dateFrom),
        lt: new Date(dateTo),
      },
    },
  });

  res.json(expenses);
});

router.get("/expenses/currentMonth", async (req, res) => {
  const currentMonthExpenses = await prisma.expenses.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    },
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
    if (expense.isEarning) return acc;
    const existingCategory = acc.find(
      (category) => category.categoryId === expense.categoryId
    );

    if (existingCategory) {
      existingCategory.amount += expense.amount;
    }

    if (!existingCategory) {
      acc.push({
        categoryId: expense.categoryId,
        amount: expense.amount,
      });
    }

    return acc;
  }, []);

  res.json(expensesByCategory);
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
