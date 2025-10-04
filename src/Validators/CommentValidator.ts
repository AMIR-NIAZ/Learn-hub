import { ValidationSchema } from "fastest-validator";
import ParentValidator from "./ParentValidator";

export class CommentValidator extends ParentValidator {
    protected getSchema(): ValidationSchema {
        return {
            body: {
                type: "string",
                min: 1,
                max: 5000,
                optional: false
            },
            course: {
                type: "string",
                required: true,
                min: 24,
                max: 24,
                optional: false,
            },
            isActive: {
                type: "boolean",
                optional: true,
                default: false
            },
            score: {
                type: "number",
                min: 0,
                max: 5,
                integer: true,
                optional: true,
                default: 5,
                convert: true
            },
            parent: {
                type: "string",
                min: 24,
                max: 24,
                optional: true,
                nullable: true
            }
        };
    }
}