export class Result<T, U> {

    constructor(public value?: T, public error?: U) { }

    IsError() {
        return this.error != null || this.value == null;
    }

    HasValue() {
        return this.value != null;
    }


}