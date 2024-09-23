import prisma from "@/lib/prisma";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookTable } from "./__partials/table";

async function getBooks() {
  return await prisma.book.findMany();
}

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="container mx-auto px-6 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Books</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">Book List</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <BookTable books={books} />
      </Suspense>
    </div>
  );
}
