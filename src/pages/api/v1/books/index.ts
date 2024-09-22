import { ApiResponse } from "@/shared/types/api-response.type";
import { toCamelCase } from "@/shared/utils/to-camel-case.util";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  genre: string;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string(),
  imageUrl: z.string(),
  genre: z.string(),
  releaseDate: z.date(),
});

async function getBooks(): Promise<Book[]> {
  const books = await prisma.book.findMany({
    orderBy: { created_at: 'desc' }
  });
  return toCamelCase(books);
}

async function createBook(book: z.infer<typeof createBookSchema>): Promise<Book> {
  const newBook = await prisma.book.create({
    data: {
      ...book,
      release_date: book.releaseDate,
      image_url: book.imageUrl
    }
  });
  return toCamelCase(newBook);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Book[] | Book>>
) {
  const response: ApiResponse<Book[] | Book> = {
    message: "",
    data: null,
    httpCode: 500,
  };

  try {
    if (req.method === "GET") {
      const books = await getBooks();
      response.message = "Books retrieved successfully";
      response.data = books;
      response.httpCode = 200;
    } else if (req.method === "POST") {
      const validatedData = createBookSchema.parse(req.body);
      const newBook = await createBook(validatedData);
      response.message = "Book created successfully";
      response.data = newBook;
      response.httpCode = 201;
    } else {
      response.message = `Method ${req.method} Not Allowed`;
      response.httpCode = 405;
      res.setHeader("Allow", ["GET", "POST"]);
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

  // Apply toCamelCase to the entire response object
  const camelCaseResponse = toCamelCase(response);

  res.status(camelCaseResponse.httpCode).json(camelCaseResponse);
}
