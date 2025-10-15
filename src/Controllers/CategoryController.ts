import { Request, Response } from "express";
import categoryDTO from "../Dto/CategoryDTO";
import Category from "../Models/Category";
import { CategoryValidator } from "../Validators/ CategoryValidator";
import { AppError } from "../Utils/AppError";
import { isValidObjectId } from "mongoose";

export class CategoryController {
    static async getAllCategory(req: Request, res: Response) {
        const allCategory = await Category.find({});
        if (!allCategory) throw new AppError("Category not find", 404);
        let categoryDto = categoryDTO.fromCategories(allCategory);
        return res.status(200).json({ success: true, Category: categoryDto });
    }

    static async getCourseByCategory(req: Request, res: Response) {
        const category = await Category.find({ name: req.params.href })
            .populate("courses")
            .lean();
        if (!category) throw new AppError("Category not find", 404);
        return res.status(200).json(category);
    }

    static async CreateCategory(req: Request, res: Response) {
        const { title, name } = req.body;
        await CategoryController.Validation(req);
        await Category.create({ title, name });
        res.status(201).json({
            success: true,
            message: "Category Created successfully",
        });
    }

    static async UpdateCategory(req: Request, res: Response) {
        const { title, name } = req.body;
        const { id } = req.params;
        await CategoryController.Validation(req)
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        await Category.findByIdAndUpdate(id, { title, name })
        return res.status(200).json({
            success: true,
            message: "title, name category updated successfull"
        })
    }

    static async DeleteCategory(req: Request, res: Response) {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        const category = await Category.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "category deleted successfull"
        })
    }

    private static async Validation(req: Request) {
        const validator = new CategoryValidator();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
    }
}