import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductDto } from "src/dto/product.dto";
import { ProductsEntity } from "src/entities/products.entity";
import { PaginationDto } from "src/dto/pagination.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard.";
import { PaginationResult } from "src/global/paginationResult";

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {

    private logger = new Logger(ProductController.name);

    constructor(private readonly productService: ProductService) { }

    @Get()
    async getProducts(
        @Req() request: any,
        @Query() paginationDto: PaginationDto,
        @Query('search') search?: string,
    ): Promise<PaginationResult<ProductsEntity>> {
        // console.log(request.user)
        // this.logger.log("find-all");
        return await this.productService.getProducts(paginationDto, search);
    }

    @Post()
    async createProduct(
        @Body() productDto: ProductDto
    ): Promise<ProductsEntity> {
        return await this.productService.createProduct(productDto);
    }

    @Get('/:id')
    async detailProduct(@Param('id') id: number): Promise<ProductsEntity> {
        return await this.productService.detailProduct(id);
    }

    @Put(':id')
    async updateProduct(
        @Param('id') id: number,
        @Body() productDto: ProductDto,
    ): Promise<ProductsEntity> {
        return await this.productService.updateProduct(+id, productDto);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: number): Promise<ProductsEntity> {
        return await this.productService.deleteProduct(+id);
    }
}