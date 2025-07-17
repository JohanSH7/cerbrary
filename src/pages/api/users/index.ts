import { log } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../lib/db"; // Adjust the import path as necessary
import { ca } from "date-fns/locale";
import { UserRole, UserStatus } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method) {
    case 'GET':
      const users = await db.user.findMany();
      res.status(200).json(users);
      break;
    case 'POST':
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }
      const newUser = await db.user.create({
        data: {
          name,
          email,
          role: "USER",
        },
      });
      res.status(201).json(newUser);
      break;
    case 'PUT':
      const { id, updatedName, status, role, enabled } = req.body; 
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      
      try {
        const updateData: {
          name?: string;
          status?: UserStatus;
          role?: UserRole;
          enabled?: boolean;
        } = {};
        
        // Actualizar el nombre si se proporciona
        if (updatedName) {
          updateData.name = updatedName;
        }
        
        // Actualizar el estado si se proporciona
        if (status) {
          updateData.status = status as UserStatus;
        }
        
        // Actualizar el rol si se proporciona
        if (role) {
          updateData.role = role as UserRole;
        }
        
        // Actualizar el campo enabled si se proporciona
        if (enabled !== undefined) {
          updateData.enabled = enabled;
        }
        
        const updatedUser = await db.user.update({
          where: { id },
          data: updateData,
        });

        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Error updating user", details: error });
      }
      break;
    case 'DELETE':
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      await db.user.delete({
        where: { id: userId },
      });
      res.status(204).end();
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  };
}
