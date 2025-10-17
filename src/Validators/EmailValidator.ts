import { ValidationSchema } from "fastest-validator";
import ParentValidator from "./ParentValidator";

export class EmailValidator extends ParentValidator {
    protected getSchema(): ValidationSchema {
        return {
            email: {
                type: "email",
                min: 5,
                max: 100,
                optional: true 
            },
        }
    }
}