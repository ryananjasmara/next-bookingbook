import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
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

async function addBook(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const author = formData.get("author") as string;
  const genre = formData.get("genre") as string;
  const release_date = formData.get("release_date") as string;
  const image_file = formData.get("image_file") as File;

  const fileName = `${Date.now()}-${image_file.name}`;

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

  const image_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/book-covers/${fileName}`;

  await prisma.book.create({
    data: {
      title,
      description,
      author,
      genre,
      release_date: new Date(release_date),
      image_url,
    },
  });

  redirect("/books");
}

export default function BookCreatePage() {
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
            <BreadcrumbPage>Add New Book</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mt-4 mb-6">New Book</h1>

      <form action={addBook} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Title
          </label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <Textarea id="description" name="description" required />
        </div>
        <div>
          <label htmlFor="author" className="block mb-1">
            Author
          </label>
          <Input id="author" name="author" required />
        </div>
        <div>
          <label htmlFor="genre" className="block mb-1">
            Genre
          </label>
          <Input id="genre" name="genre" required />
        </div>
        <div>
          <label htmlFor="release_date" className="block mb-1">
            Release Date
          </label>
          <Input id="release_date" name="release_date" type="date" required />
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
            required
          />
        </div>
        <Button type="submit">Add Book</Button>
      </form>
    </div>
  );
}
