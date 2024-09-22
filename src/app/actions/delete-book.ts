"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteBook(id: string) {
  try {
    await prisma.book.delete({
      where: { id },
    });
    revalidatePath("/books");
    return { success: true };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { success: false, error: "Failed to delete book" };
  }
}
