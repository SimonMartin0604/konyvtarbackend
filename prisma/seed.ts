import dotenv from 'dotenv';
import { PrismaClient , books} from '../generated/prisma/client';
import { faker } from '@faker-js/faker';
dotenv.config();

const prisma = new PrismaClient();

async function main(){
    await prisma.$transaction(async (tx) => {
        const allBooks : books[]= await tx.books.findMany();

        for(let i = 0; i < 15; i++){
            const randomBook = faker.helpers.arrayElement(allBooks);

            await tx.rentals.create({
              data:{
                book_id: randomBook.id,
                start_date: faker.date.past(),
                end_date: faker.date.future()
              }
            })
        }
    })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });