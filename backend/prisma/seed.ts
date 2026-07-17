import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clear out any existing books to prevent duplication errors
  await prisma.book.deleteMany();

  // 2. Insert the book records
  const books = await prisma.book.createMany({
    data: [
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        description: "A handbook of agile software craftsmanship that teaches you how to write beautiful, readable, and maintainable code with real-world examples.",
        price: 44.99,
        stock: 15,
        coverImage: ""
      },
      {
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        description: "The definitive guide to understanding systems architecture, storage engines, processing frameworks, and scalability behind modern data backends.",
        price: 49.99,
        stock: 8,
        coverImage: ""
      },
      {
        title: "Refactoring",
        author: "Martin Fowler",
        description: "Discover the art of improving the internal design of existing code without changing its external behavior, complete with structural step-by-step paths.",
        price: 39.99,
        stock: 12,
        coverImage: ""
      },
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        description: "Classic career-long wisdom covering software development best practices, maintaining focus, managing architectural complexities, and code craftsmanship.",
        price: 42.50,
        stock: 20,
        coverImage: ""
      }
    ]
  });

  console.log(`✅ Successfully seeded ${books.count} books into the database!`);
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });