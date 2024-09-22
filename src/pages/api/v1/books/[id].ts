import { ApiResponse } from "@/shared/types/api-response.type";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { toCamelCase } from "@/shared/utils/to-camel-case.util";

const prisma = new PrismaClient();

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  image_url: string;
  genre: string;
  release_date: Date;
  created_at: Date;
  updated_at: Date;
};

const updateBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string(),
  image_url: z.string(),
  genre: z.string(),
  release_date: z.date(),
});

async function getBook(id: string): Promise<Book | null> {
  const book = await prisma.book.findUnique({
    where: { id },
  });
  return toCamelCase(book);
}

async function updateBook(
  id: string,
  book: z.infer<typeof updateBookSchema>
): Promise<Book | null> {
  const updatedBook = await prisma.book.update({
    where: { id },
    data: book,
  });
  return toCamelCase(updatedBook);
}

async function deleteBook(id: string): Promise<boolean> {
  const deletedBook = await prisma.book.delete({
    where: { id },
  });
  return toCamelCase(deletedBook);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Book | null>>
) {
  const { id } = req.query;
  const response: ApiResponse<Book | null> = {
    message: "",
    data: null,
    httpCode: 200,
  };

  try {
    if (req.method === "GET") {
      const book = await getBook(id as string);
      if (book) {
        response.data = book;
        response.message = "Book retrieved successfully";
      } else {
        response.message = "Book not found";
        response.httpCode = 404;
      }
    } else if (req.method === "PUT") {
      const validatedData = updateBookSchema.parse(req.body);
      const updatedBook = await updateBook(id as string, validatedData);
      if (updatedBook) {
        response.data = updatedBook;
        response.message = "Book updated successfully";
      } else {
        response.message = "Book not found";
        response.httpCode = 404;
      }
    } else if (req.method === "DELETE") {
      const deleted = await deleteBook(id as string);
      if (deleted) {
        response.message = "Book deleted successfully";
      } else {
        response.message = "Book not found";
        response.httpCode = 404;
      }
    } else {
      response.message = `Method ${req.method} Not Allowed`;
      response.httpCode = 405;
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.message = error.issues[0]?.message || "Validation error";
      response.httpCode = 400;
    } else {
      console.error(error);
      response.message = "Internal Server Error";
      response.httpCode = 500;
    }
  }

  res.status(response.httpCode).json(response);
}
