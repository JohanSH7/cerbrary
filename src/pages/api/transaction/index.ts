import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
  try {
    const { userId } = req.query;

    const transactions = await db.transaction.findMany({
      where: userId ? { userId: userId as string } : undefined,
      include: {
        book: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      bookTitle: transaction.book.title,
      userName: transaction.user.name,
      status: transaction.status,
      createdAt: transaction.loanDate,
      returnDate: transaction.returnDate,
    }));

    res.status(200).json(formattedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
  break;


    case 'POST':
      try {
        const { bookId, userId, type = 'LOAN' } = req.body;
        if (!bookId || !userId) {
          return res.status(400).json({ error: "bookId y userId son requeridos" });
        }

        const transaction = await db.transaction.create({
          data: {
            bookId,
            userId,
            type,
            status: 'ACTIVE',
            loanDate: new Date(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
          },
        });

        await db.book.update({
          where: { id: bookId },
          data: { availableCopies: { decrement: 1 } },
        });

        res.status(201).json(transaction);
      } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
      break;

    case 'PUT':
      try {
        const { transactionId, status } = req.body;

        // Validar que los datos necesarios estén presentes
        if (!transactionId || !status) {
          return res.status(400).json({ error: "transactionId y status son requeridos" });
        }

        // Actualizar la transacción con el nuevo estado
        const updatedTransaction = await db.transaction.update({
          where: { id: transactionId },
          data: {
            status,
            returnDate: status === 'COMPLETED' ? new Date() : null, // Registrar la fecha de devolución si es COMPLETED
          },
          include: {
            book: true, // Incluye el libro para obtener el bookId
          },
        });

        // Si el estado es "COMPLETED", incrementar las copias disponibles del libro
        if (status === 'COMPLETED') {
          await db.book.update({
            where: { id: updatedTransaction.bookId },
            data: { availableCopies: { increment: 1 } },
          });
        }

        res.status(200).json(updatedTransaction);
      } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
