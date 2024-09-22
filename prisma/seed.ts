import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.book.create({
    data: {
      title: 'The Great Gatsby',
      description: 'A novel by F. Scott Fitzgerald',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic',
      release_date: new Date('1925-04-10'),
      image_url: 'https://m.media-amazon.com/images/I/81QuEGw8VPL._SL1500_.jpg',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
