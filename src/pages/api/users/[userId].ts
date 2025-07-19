import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/db"; // Ajusta la ruta según tu configuración

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    if (req.method === 'GET') {
        try {
            if (!userId) {
                return res.status(400).json({ error: "El userId es requerido" });
            }

            const user = await db.user.findUnique({
                where: { id: userId as string },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    status: true,
                },
            });

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.status(200).json(user);
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
}