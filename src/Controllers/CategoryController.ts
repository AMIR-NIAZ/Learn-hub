import { Request, Response } from "express";
import categoryDTO from "../Dto/CategoryDTO";
import { ICategory } from "../Interfaces/ICategory";
import Category from "../Models/Category";
import { CategoryValidator } from "../Validators/ CategoryValidator";
import { AppError } from "../Utils/AppError";

export class CategoryController {
    static async getAllCategory(req: Request, res: Response) {
        const allCategory: ICategory[] = await Category.find({})
        let categoryDto = categoryDTO.fromcategorys(allCategory)
        return res.status(200).json(categoryDto)
    }

    static async CreateCategory(req: Request, res: Response) {
        const { title, name } = req.body;
        const validator = new CategoryValidator();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
        await Category.create({ title, name })
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        })
    }
}