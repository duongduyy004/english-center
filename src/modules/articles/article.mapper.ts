import { ArticleEnity } from './entities/article.entity';
import { Article } from './article.domain';

export class ArticleMapper {
    static toDomain(raw: ArticleEnity): Article {
        const domain = new Article();
        domain.id = raw.id;
        domain.title = raw.title;
        domain.content = raw.content;
        domain.file = raw.file;
        domain.publicId = raw.publicId;
        domain.menu = raw.menu;
        domain.createdAt = raw.createdAt;
        domain.updatedAt = raw.updatedAt;
        return domain;
    }
}
