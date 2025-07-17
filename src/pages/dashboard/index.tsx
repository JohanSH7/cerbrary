import { DashboardLayout } from "@/components/templates/dashboardLayout";
import { withPageAuth } from "@/hooks/withPageAuth";
import { GetServerSideProps } from "next";
import Catalogo from "@/components/organism/catalogo";
import { db } from "@/lib/db";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  availableCopies: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  coverImageUrl?: string;
  description?: string;
  isbn?: string;
}

interface DashboardPageProps {
  books: Book[];
}

export default function DashboardPage({ books }: DashboardPageProps) {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <p>Este panel es accesible por usuarios aprobados (ADMIN o USER).</p>
      <Catalogo initialBooks={books} />
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
  try {
    const books = await db.book.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    const serializedBooks = books.map(book => ({
      ...book,
      createdAt: book.createdAt.toISOString(),
      updatedAt: book.updatedAt.toISOString(),
      publicationYear: book.publicationYear || 0,
      availableCopies: book.availableCopies || 0,
    }));

    return {
      props: {
        books: serializedBooks,
      },
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    return {
      props: {
        books: [],
      },
    };
  }
});