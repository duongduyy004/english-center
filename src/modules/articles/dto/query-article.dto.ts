import { Article } from "../article.domain";

export class FilterArticleDto {
    title?: string;
    content?: string;
    menuId?: string;
}

export class SortArticleDto {
    orderBy: keyof Article;
    order: 'ASC' | 'DESC';
}
