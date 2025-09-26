import { ICategory } from '../Interfaces/ICategory';
import { BaseDTO } from './BaseDTO';

export class categoryDTO extends BaseDTO <ICategory>{
    public title: string;
    public name: string;
    constructor(category: ICategory) {
        super(category);
        this.title = category.title;
        this.name = category.name;
    }

    static fromcategory(category: ICategory): categoryDTO {
        return new categoryDTO(category);
    }

    static fromcategorys(categorys: ICategory[]): categoryDTO[] {
        return categorys.map(category => new categoryDTO(category));
    }

    toObject(): object {
        return {
            id: this.id,
            title: this.title,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }
}

export default categoryDTO;