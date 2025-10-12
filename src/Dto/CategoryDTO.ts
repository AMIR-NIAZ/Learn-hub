import { ICategory } from '../Interfaces/ICategory';
import { BaseDTO } from './BaseDTO';

export class CategoryDTO extends BaseDTO<ICategory> {
    constructor(public readonly category: ICategory) {
        super(category);
    }

    toDTO() {
        const {
            _id,
            title,
            name,
            createdAt,
            updatedAt
        } = this.category;

        return {
            id: _id,
            title,
            name,
            createdAt,
            updatedAt
        };
    }

    static fromCategory(category: ICategory) {
        return new CategoryDTO(category).toDTO();
    }

    static fromCategories(categories: ICategory[]) {
        return categories.map(category => new CategoryDTO(category).toDTO());
    }
}

export default CategoryDTO;
