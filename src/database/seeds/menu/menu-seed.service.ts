import { MenuEntity } from "@/modules/menus/entities/menu.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class MenuSeedService {
    constructor(
        @InjectRepository(MenuEntity) private menuRepository: Repository<MenuEntity>
    ) { }

    async run() {
        const menus = await this.menuRepository.find()
        if (menus.length > 0) return;

        await this.menuRepository.save(
            this.menuRepository.create({
                title: 'Trang chủ',
                slug: '',
                order: 0
            }),
            { listeners: false }
        )

        await this.menuRepository.save(
            this.menuRepository.create({
                title: 'Về chúng tôi',
                slug: 'about-us',
                order: 0
            }),
            { listeners: false }
        )

        await this.menuRepository.save(
            this.menuRepository.create({
                title: 'Giáo viên',
                slug: 'teacher',
                order: 0
            }),
            { listeners: false }
        )

        await this.menuRepository.save(
            this.menuRepository.create({
                title: 'Đánh giá',
                slug: 'rating',
                order: 0
            }),
            { listeners: false }
        )
    }
}