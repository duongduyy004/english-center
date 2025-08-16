import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionCategoryEntity } from "./entities/transaction-category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class TransactionsCategoryService {
    constructor(
        @InjectRepository(TransactionCategoryEntity)
        private readonly categoryRepo: Repository<TransactionCategoryEntity>,
    ) { }

    async create(dto: CreateCategoryDto): Promise<TransactionCategoryEntity> {
        const entity = this.categoryRepo.create({ ...dto });
        return this.categoryRepo.save(entity);
    }

    async findAll(): Promise<TransactionCategoryEntity[]> {
        return this.categoryRepo.find();
    }

    async findOne(id: number): Promise<TransactionCategoryEntity> {
        const entity = await this.categoryRepo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException("Category not found");
        return entity;
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<TransactionCategoryEntity> {
        const preloaded = await this.categoryRepo.preload({ id, ...dto } as any);
        if (!preloaded) throw new NotFoundException("Category not found");
        return this.categoryRepo.save(preloaded);
    }

    async remove(id: number): Promise<void> {
        const result = await this.categoryRepo.softDelete(id);
        if (!result.affected) throw new NotFoundException("Category not found");
    }
}