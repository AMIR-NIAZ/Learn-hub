import Validator, { ValidationSchema } from "fastest-validator";

export default abstract class ParentValidator {
    private validator: Validator;

    constructor() {
        this.validator = new Validator();
    }

    protected abstract getSchema(): ValidationSchema;

    public validate(data: object) {
        const check = this.validator.compile(this.getSchema());
        const result = check(data);

        if (result === true) {
            return null;
        }
        return result;
    }
}
