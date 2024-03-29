import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { appendFile, existsSync, mkdirSync } from "fs-extra";
import { join } from "path";
import { QueryFailedError } from "typeorm";

import { CustomHttpExceptionResponse } from "./models/http-exception-response.interface";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let tinyErrorMessage: string;
    let fullErrorMessage: string;
    let errorMessage: string;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage = errorResponse["message"];
    } else if (exception instanceof TypeError) {
      status = HttpStatus.BAD_REQUEST;
      errorMessage = exception.message
        .substring(exception.message.indexOf("\n\n\n") + 1)
        .trim();
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      tinyErrorMessage = exception.message
        .substring(exception.message.indexOf("\n\n\n") + 1)
        .trim();
      fullErrorMessage = exception["sql"];
      errorMessage = "Critical internal server error occurred!";
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "Critical internal server error occurred!";
      fullErrorMessage = JSON.stringify(exception);
    }
    const errorResponse = this.getErrorResponse(status, errorMessage);
    const errorLog = this.getErrorLog(
      tinyErrorMessage,
      fullErrorMessage,
      errorResponse,
      request,
      exception,
    );
    this.writeErrorLogToFile(errorLog);
    response.status(status).json(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
  });

  private getErrorLog = (
    tinyErrorMessage: string,
    fullErrorMessage: string,
    errorResponse: CustomHttpExceptionResponse,
    request: Request,
    exception: unknown,
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;
    const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}
    ${JSON.stringify(errorResponse)}
    ${tinyErrorMessage != undefined ? tinyErrorMessage : ""}
    ${fullErrorMessage != undefined ? fullErrorMessage : ""}
    ${exception instanceof HttpException ? exception.stack : error}\n\n`;
    return errorLog;
  };

  private writeErrorLogToFile = (errorLog: string): void => {
    const logDir = join(__dirname, "../../../", "logs");
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    appendFile(
      join(__dirname, "../../../", "logs/error.log"),
      errorLog,
      "utf8",
      err => {
        if (err) throw err;
      },
    );
  };
}
