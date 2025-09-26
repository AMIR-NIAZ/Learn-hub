import { ValidationSchema } from "fastest-validator";
import ParentValidator from "./ParentValidator";

export class Register extends ParentValidator {
    protected getSchema(): ValidationSchema {
        return {
            name: {
                type: "string",
                min: 4,
                max: 20,
                optional: true 
            },
            email: {
                type: "email",
                min: 5,
                max: 100,
                optional: true 
            },
            password: {
                type: "string",
                min: 8,
                max: 24,
                optional: true 
            },
        }
    }
}