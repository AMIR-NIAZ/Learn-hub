// src/Validators/SessionValidator.ts
import { ValidationSchema } from "fastest-validator";
import ParentValidator from "./ParentValidator";

export class SessionValidator extends ParentValidator {
    protected getSchema(): ValidationSchema {
        return {
            title: {
                type: "string",
                min: 3,
                max: 100,
                empty: false,
            },
            free: {
                type: "boolean",
                optional: true, 
            },
            course: {
                type: "string",
                pattern: /^[a-zA-Z0-9_-]+$/, 
                empty: false,
            },
        };
    }
}
