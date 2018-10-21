export default class Validate {
    constructor(input, type) {
        this.types = {
            'tel': /^(()|(8 )|(\+7 ))\d{3} \d{3} \d{2} \d{2}$/,
            'email': /^.+@.+$/
        };

        this.input = input;
        this.type = type;
    }

    init() {
        this.$input = $(this.input);
        this.type = this.types[this.type];

        return this;
    }

    isValid() {
        return this.$input.length && this.type && this.type.test(this.$input.val());
    }
}
