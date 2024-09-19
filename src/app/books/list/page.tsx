"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
};

const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
];

const books: Book[] = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960 },
  { id: 2, title: "1984", author: "George Orwell", year: 1949 },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
  },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen", year: 1813 },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    year: 1951,
  },
  {
    id: 6,
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    year: 1967,
  },
  { id: 7, title: "Brave New World", author: "Aldous Huxley", year: 1932 },
  { id: 8, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937 },
  {
    id: 9,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    year: 1954,
  },
  { id: 10, title: "Moby-Dick", author: "Herman Melville", year: 1851 },
  { id: 11, title: "Jane Eyre", author: "Charlotte Brontë", year: 1847 },
  { id: 12, title: "Wuthering Heights", author: "Emily Brontë", year: 1847 },
  { id: 13, title: "The Odyssey", author: "Homer", year: -800 },
  {
    id: 14,
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    year: 1866,
  },
  {
    id: 15,
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    year: 1880,
  },
  { id: 16, title: "War and Peace", author: "Leo Tolstoy", year: 1869 },
  { id: 17, title: "Anna Karenina", author: "Leo Tolstoy", year: 1877 },
  { id: 18, title: "Madame Bovary", author: "Gustave Flaubert", year: 1856 },
  {
    id: 19,
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    year: 1890,
  },
  {
    id: 20,
    title: "The Adventures of Huckleberry Finn",
    author: "Mark Twain",
    year: 1884,
  },
  { id: 21, title: "Don Quixote", author: "Miguel de Cervantes", year: 1605 },
  { id: 22, title: "Frankenstein", author: "Mary Shelley", year: 1818 },
  {
    id: 23,
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    year: 1844,
  },
  {
    id: 24,
    title: "The Grapes of Wrath",
    author: "John Steinbeck",
    year: 1939,
  },
  { id: 25, title: "Catch-22", author: "Joseph Heller", year: 1961 },
  {
    id: 26,
    title: "The Sun Also Rises",
    author: "Ernest Hemingway",
    year: 1926,
  },
  {
    id: 27,
    title: "The Old Man and the Sea",
    author: "Ernest Hemingway",
    year: 1952,
  },
  { id: 28, title: "Lolita", author: "Vladimir Nabokov", year: 1955 },
  { id: 29, title: "Ulysses", author: "James Joyce", year: 1922 },
  { id: 30, title: "The Metamorphosis", author: "Franz Kafka", year: 1915 },
];

export default function BookList() {
  return (
    <div className="container mx-auto px-6 py-8"> {/* Adjusted padding */}
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

      <DataTable columns={columns} data={books} />
    </div>
  );
}
