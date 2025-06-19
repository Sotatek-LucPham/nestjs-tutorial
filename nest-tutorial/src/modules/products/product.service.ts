import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/dto/pagination.dto';
import { ProductDto } from 'src/dto/product.dto';
import { ProductsEntity } from 'src/entities/products.entity';
import { PaginationResult } from 'src/global/globalClass';
import { Product } from 'src/models/product.model';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductsEntity)
        private readonly productsRepository: Repository<ProductsEntity>
    ) { }

    async getProducts(paginationDto: PaginationDto, search?: String): Promise<PaginationResult<ProductsEntity>> {
        const { skip, limit, sort, order, page } = paginationDto;

        const queryBuilder = this.productsRepository.createQueryBuilder('product');

        if (search) {
            queryBuilder.where('product.productName LIKE :search', { search: `%${search}%` });
        }

        // sắp xếp nếu có truyền sort
        if (sort) {
            queryBuilder.orderBy(`product.${sort}`, order ?? 'ASC');
        }

        const [data, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            data,
            totalRecords: total,
            currentPage: +page,
            pageSize: +limit,
            totalPages: Math.ceil(total / paginationDto.limit),
        };
    }

    async createProduct(productDto: ProductDto): Promise<ProductsEntity> {
        const productsEntity = this.productsRepository.create();
        productsEntity.productName = productDto.productName;
        productsEntity.price = productDto.price;
        productsEntity.categoryId = productDto.categoryId;

        return await this.productsRepository.save(productsEntity);
    }

    async detailProduct(id: number): Promise<ProductsEntity> {
        const product = await this.productsRepository.findOneBy({ id });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        return product;
    }

    async updateProduct(id: number, productDto: ProductDto): Promise<ProductsEntity> {
        const product = await this.productsRepository.findOneBy({ id });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        await this.productsRepository.update(id, productDto);

        const updated = await this.productsRepository.findOneBy({ id });

        if (!updated) {
            throw new InternalServerErrorException(`Failed to retrieve updated product with id ${id}`);
        }

        return updated;
    }

    async deleteProduct(id: number): Promise<ProductsEntity> {
        const product = await this.productsRepository.findOneBy({ id });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        await this.productsRepository.delete(id);

        return product;
    }
}