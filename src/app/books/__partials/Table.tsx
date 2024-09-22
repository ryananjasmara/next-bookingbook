"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Book } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useTransition } from 'react';
import { deleteBook } from '@/app/actions/delete-book';

interface BookTableProps {
  books: Book[];
}

export const BookTable = ({ books }: BookTableProps) => {
  const router = useRouter();
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const columns: ColumnDef<Book>[] = [
    {
      accessorKey: "id",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description;
        return description.length > 100
          ? `${description.slice(0, 100)}...`
          : description;
      },
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "genre",
      header: "Genre",
    },
    {
      accessorKey: "release_date",
      header: "Release Date",
      cell: ({ row }) => {
        const date = new Date(row.original.release_date);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "image_url",
      header: "Image",
      cell: ({ row }) => (
        <Image
          src={row.original.image_url}
          alt={row.original.title}
          width={50}
          height={75}
          className="object-cover"
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/books/${book.id}/edit`)}
            >
              Edit
            </Button>
            <Dialog open={openDialogId === book.id} onOpenChange={(open) => setOpenDialogId(open ? book.id : null)}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent 
                onClick={(e) => e.stopPropagation()} 
                className="max-w-sm mx-auto p-4 sm:p-6 rounded-lg"
              >
                <DialogHeader>
                  <DialogTitle className="text-lg font-medium">Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the book.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4 sm:mt-0">
                  <Button variant="outline" onClick={() => setOpenDialogId(null)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(book.id)} className="w-full sm:w-auto">
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  const onRowClick = (book: Book) => {
    router.push(`/books/${book.id}`);
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const result = await deleteBook(id);
      if (result.success) {
        // Optionally update local state or show a success message
      } else {
        // Handle error, maybe show an error message
      }
    });
    setOpenDialogId(null);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DataTable columns={columns} data={books} onRowClick={onRowClick} />
    </div>
  );
};
