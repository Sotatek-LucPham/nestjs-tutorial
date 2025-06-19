import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsEntity } from "src/entities/products.entity";

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [TypeOrmModule.forFeature([ProductsEntity])],
})

export class ProductModule { };