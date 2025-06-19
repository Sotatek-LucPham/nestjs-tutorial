import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { PaginationResult, ResponseData } from "src/global/globalClass";
import { HttpMessage, HttpStatus } from "src/global/globalEnum";
import { ProductDto } from "src/dto/product.dto";
import { ProductsEntity } from "src/entities/products.entity";
import { PaginationDto } from "src/dto/pagination.dto";

@Controller('products')

export class ProductController {

    constructor(private readonly productService: ProductService) { }

    @Get()
    async getProducts(
        @Query() paginationDto: PaginationDto,
        @Query('search') search?: string,
    ): Promise<ResponseData<PaginationResult<ProductsEntity>>> {
        try {
            return new ResponseData<PaginationResult<ProductsEntity>>(await this.productService.getProducts(paginationDto, search), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<PaginationResult<ProductsEntity>>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Post()
    async createProduct(
        @Body() productDto: ProductDto
    ): Promise<ResponseData<ProductsEntity>> {
        try {
            const created = await this.productService.createProduct(productDto);
            return new ResponseData<ProductsEntity>(
                created,
                HttpStatus.SUCCESS,
                HttpMessage.SUCCESS
            );
        } catch (error) {
            return new ResponseData<ProductsEntity>(
                null,
                HttpStatus.ERROR,
                error.message
            );
        }
    }

    @Get('/:id')
    async detailProduct(@Param('id') id: number): Promise<ResponseData<ProductsEntity>> {
        try {
            const product = await this.productService.detailProduct(id);
            return new ResponseData<ProductsEntity>(product, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<ProductsEntity>(null, HttpStatus.ERROR, HttpMessage.ERROR);
        }
    }

    @Put(':id')
    async updateProduct(
        @Param('id') id: number,
        @Body() productDto: ProductDto,
    ): Promise<ResponseData<ProductsEntity>> {
        try {
            const updated = await this.productService.updateProduct(+id, productDto);
            return new ResponseData<ProductsEntity>(updated, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<ProductsEntity>(null, HttpStatus.ERROR, error.message);
        }
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: number): Promise<ResponseData<ProductsEntity>> {
        try {
            const deleted = await this.productService.deleteProduct(+id);
            return new ResponseData<ProductsEntity>(deleted, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
        } catch (error) {
            return new ResponseData<ProductsEntity>(null, HttpStatus.ERROR, error.message);
        }
    }
}