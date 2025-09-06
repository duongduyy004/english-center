import { Article } from "../article.domain";

export class FilterArticleDto {
    title?: string;
    content?: string;
    menuId?: string;
    order?: number;
    isActive?: boolean;
}

export class SortArticleDto {
    orderBy: keyof Article;
    order: 'ASC' | 'DESC';
}
