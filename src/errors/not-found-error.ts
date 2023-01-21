import CustomError from "./custom-error";

export default class NotFoundError extends CustomError {
  constructor(public message: string = "Not Found") {
    super(message);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  statusCode(): number {
    return 404;
  }
  serializeError(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
