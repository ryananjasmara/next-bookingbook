import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateUploadURL } from "@/lib/s3";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function getBook(id: string) {
  const book = await prisma.book.findUnique({
    where: { id },
  });
  if (!book) notFound();
  return book;
}

async function updateBook(id: string, formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const author = formData.get("author") as string;
  const genre = formData.get("genre") as string;
  const release_date = formData.get("release_date") as string;
  const image_file = formData.get("image_file") as File | null;

  let image_url;

  if (image_file && image_file.size > 0) {
    const fileName = image_file.name;
    const uploadURL = await generateUploadURL(fileName);

    const uploadResponse = await fetch(uploadURL, {
      method: "PUT",
      body: image_file,
      headers: {
        "Content-Type": image_file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image to S3");
    }

    image_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/book-covers/${fileName}`;
  }

  await prisma.book.update({
    where: { id },
    data: {
      title,
      description,
      author,
      genre,
      release_date: new Date(release_date),
      ...(image_url && { image_url }),
    },
  });

  redirect("/books");
}

export default async function BookEditPage({
  params,
}: {
  params: { id: string };
}) {
  const book = await getBook(params.id);

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
            <BreadcrumbPage>Edit Book</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">{book.title}</h1>

      <form action={updateBook.bind(null, book.id)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Title
          </label>
          <Input id="title" name="title" defaultValue={book.title} required />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            defaultValue={book.description}
            required
          />
        </div>
        <div>
          <label htmlFor="author" className="block mb-1">
            Author
          </label>
          <Input
            id="author"
            name="author"
            defaultValue={book.author}
            required
          />
        </div>
        <div>
          <label htmlFor="genre" className="block mb-1">
            Genre
          </label>
          <Input id="genre" name="genre" defaultValue={book.genre} required />
        </div>
        <div>
          <label htmlFor="release_date" className="block mb-1">
            Release Date
          </label>
          <Input
            id="release_date"
            name="release_date"
            type="date"
            defaultValue={book.release_date.toISOString().split("T")[0]}
            required
          />
        </div>
        <div>
          <label htmlFor="image_file" className="block mb-1">
            Book Cover Image
          </label>
          <Input
            id="image_file"
            name="image_file"
            type="file"
            accept="image/*"
          />
          <p className="text-sm text-gray-500 mt-1">
            Current image: {book.image_url}
          </p>
        </div>
        <Button type="submit">Update Book</Button>
      </form>
    </div>
  );
}
