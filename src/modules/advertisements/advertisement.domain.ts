import { Class } from "@/modules/classes/class.domain";

export class Advertisement {
    id: string;
    title: string;
    description: string;
    type: 'popup' | 'banner';
    priority: number;
    imageUrl: string;
    publicId: string;
    classId?: string;
    class?: Partial<Class>;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}