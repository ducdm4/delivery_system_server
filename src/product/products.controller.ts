import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Response } from 'express';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly userService: ProductsService) {}

  @Get()
  findAll(@Res() res: Response) {
    res.status(HttpStatus.OK).json({ product: 'prod' });
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    res.status(HttpStatus.CREATED).json(createProductDto);
  }
}
