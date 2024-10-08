import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';

const BookDetailPage = async ({ params }: { params: { id: string } }) => {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
  });

  if (!book) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/books">Books</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{book.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mt-4 mb-6">{book.title}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Book Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="space-y-4 flex-1">
              <div>
                <p className="font-semibold">Author:</p>
                <p>{book.author}</p>
              </div>
              <div>
                <p className="font-semibold">Genre:</p>
                <Badge>{book.genre}</Badge>
              </div>
              <div>
                <p className="font-semibold">Release Date:</p>
                <p>{new Date(book.release_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Description:</p>
                <p>{book.description}</p>
              </div>
            </div>
            <div className="flex-1">
              <Image 
                src={book.image_url} 
                alt={book.title} 
                width={200} 
                height={300} 
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetailPage;
