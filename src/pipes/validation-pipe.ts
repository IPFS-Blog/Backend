import { HttpStatus, ValidationPipe } from "@nestjs/common";

export const validationPipe = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  stopAtFirstError: false,
  disableErrorMessages: false,
  whitelist: true,
  transform: true,
});
