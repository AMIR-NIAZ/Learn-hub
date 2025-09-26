import { ValidationSchema } from "fastest-validator";
import ParentValidator from "./ParentValidator";

export class  CategoryValidator extends ParentValidator {
    protected getSchema(): ValidationSchema {
        return {
            title: {
                type: "string",
                min: 5,
                max: 100
            },
            name: {
                type: "string",
                min: 2,
                max: 10,
                pattern: /^[a-zA-Z0-9_-]+$/,
            },
        }
    }
}