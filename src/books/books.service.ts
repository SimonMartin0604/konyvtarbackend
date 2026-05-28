import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly db: PrismaService){}
  create(createBookDto: CreateBookDto) {
    return this.db.books.create({
      data:{
        title: createBookDto.title,
        author: createBookDto.author,
        publish_year: createBookDto.publish_year,
        page_count: createBookDto.page_count
      },select:{
        id: true,
        title: true,
        author: true,
        publish_year: true,
        page_count: true
      }
    });
  }

  async rent(bookId: number){
    const book = await this.db.books.findUnique({
      where: {id: bookId},
    })
    if(!book){
      throw new NotFoundException("A könyv nem található!")
    }
    const most = new Date();
    const hetmulva = new Date();
    hetmulva.setDate(most.getDate()+7);

    const aktivrental= await this.db.rentals.findFirst({
      where:{
        id: bookId,
        start_date: {lte: most},
        end_date: {gte: most}
      }
    })
    if(aktivrental){
      throw new ConflictException("A könyv már ki van bérelve.");
    }

    const newRental = this.db.rentals.create({
      data:{
        book_id: bookId,
        start_date: most,
        end_date: hetmulva
      }
    })
    return{
      id: (await newRental).id,
      book_id: (await newRental).book_id,
      start_date: (await newRental).start_date,
      end_date: (await newRental).end_date
    }
  }

  findAll() {
    return this.db.books.findMany({
      select:{
        id: true,
        title: true,
        author: true,
        publish_year: true,
        page_count: true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
