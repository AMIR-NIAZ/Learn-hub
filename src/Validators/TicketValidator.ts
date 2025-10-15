import { ValidationSchema } from "fastest-validator";
import ParentValidator from "./ParentValidator";

export class TicketValidator extends ParentValidator {
    protected getSchema(): ValidationSchema {
        return {
            title: {
                type: "string",
                Optional: false
            },
            body: {
                type: "string",
                Optional: false
            },
        };
    }
}
