import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const { q } = req.query;
    if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "El parámetro 'q' es obligatorio" });
    }

    try {
        const books = await db.book.findMany({
            where: {
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { author: { contains: q, mode: "insensitive" } },
                    { genre: { contains: q, mode: "insensitive" } },
                ],
            },
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: "Error buscando libros", details: error });
    }
}