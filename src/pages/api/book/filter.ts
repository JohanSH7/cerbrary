import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Si hay filtros en la query, aplicarlos
      const { year, author } = req.query;
      const where: {
        publicationYear?: number;
        author?: { contains: string; mode: "insensitive" };
      } = {};
      if (year) where.publicationYear = Number(year);
      if (author) where.author = { contains: String(author), mode: "insensitive" };

      try {
        const books = await db.book.findMany({ where });
        res.status(200).json(books);
      } catch (error) {
        res.status(500).json({ error: "Error fetching books", details: error });
      }
      break;
    // ...POST, PUT, DELETE como ya tienes...
    // ...existing code...
  }
}