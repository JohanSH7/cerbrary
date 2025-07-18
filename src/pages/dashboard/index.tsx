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
      <div className="space-y-8">
        <div className="border-b border-[#EADBC8] pb-6">
          <h1 className="text-4xl font-bold text-[#4B3C2A] tracking-tight mb-3">
            Bienvenido al Dashboard
          </h1>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#D5C2A5] rounded-2xl p-6 text-[#4B3C2A] shadow">
            <h3 className="text-sm font-medium uppercase tracking-wider">Total de Libros</h3>
            <p className="text-3xl font-bold mt-2">{books.length}</p>
          </div>
          <div className="bg-[#EADBC8] rounded-2xl p-6 text-[#4B3C2A] shadow">
            <h3 className="text-sm font-medium uppercase tracking-wider">Disponibles</h3>
            <p className="text-3xl font-bold mt-2">
              {books.filter(book => book.availableCopies > 0).length}
            </p>
          </div>
          <div className="bg-[#F3EEE7] rounded-2xl p-6 text-[#4B3C2A] shadow">
            <h3 className="text-sm font-medium uppercase tracking-wider">Géneros</h3>
            <p className="text-3xl font-bold mt-2">
              {new Set(books.map(book => book.genre)).size}
            </p>
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl p-6 border border-[#EADBC8]">
          
          <Catalogo initialBooks={books} />
        </div>
      </div>
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
