import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Listar todos los libros
      const books = await db.book.findMany();
      res.status(200).json(books);
      break;
   case 'POST':
      const {
        title,
        author,
        isbn,
        genre,
        publicationYear,
        totalCopies,
        availableCopies,
        description,
        coverImageUrl,
        createdById
      } = req.body;

      if (!title || !author || !createdById) {
        return res.status(400).json({ error: "Title, author and createdById are required" });
      }

      try {
        const newBook = await db.book.create({
          data: {
            title,
            author,
            isbn,
            genre,
            publicationYear,
            totalCopies: totalCopies ?? 1,
            availableCopies: availableCopies ?? totalCopies ?? 1,
            description,
            coverImageUrl,
            createdById,
          },
        });
        res.status(201).json(newBook);
      } catch (error) {
        console.error("ERROR:", error); // <-- Aquí
        res.status(500).json({ error: "Error creating book", details: error });
      }
      break;
    case 'PUT':
      // Actualizar un libro existente
      const { id, updatedData } = req.body;
      if (!id || !updatedData) {
        return res.status(400).json({ error: "ID and updatedData are required" });
      }
      const updatedBook = await db.book.update({
        where: { id },
        data: updatedData,
      });
      res.status(200).json(updatedBook);
      break;
    case 'DELETE':
      // Eliminar un libro
      const { bookId } = req.body;
      if (!bookId) {
        return res.status(400).json({ error: "Book ID is required" });
      }
      await db.book.delete({
        where: { id: bookId },
      });
      res.status(204).end();
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}