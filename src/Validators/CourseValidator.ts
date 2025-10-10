import { ValidationSchema } from "fastest-validator";
import ParentValidator from "./ParentValidator";

export class CourseValidator extends ParentValidator {
    protected getSchema(): ValidationSchema {
        return {
            title: {
                type: "string",
                min: 3,
                max: 100,
                optional: false
            },
            description: {
                type: "string",
                min: 10,
                max: 1000,
                optional: false
            },
            price: {
                type: "number",
                positive: true,
                integer: false,
                optional: false,
                convert: true
            },
            status: {
                type: "enum",
                values: ["draft", "published", "archived"],
                optional: false
            },
            time: {
                type: "number",
                default: 0,
                positive: true,
                integer: true,
                optional: false,
                convert: true
            },
            category: {
                type: "string",
                min: 24,
                max: 24,
                optional: false,
            }
        };
    }
}
