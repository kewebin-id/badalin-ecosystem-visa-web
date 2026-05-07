import { validationMessage } from '@/shared/constants';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';
import { ResponseREST } from './types';

type ResponsePayload<T extends Partial<object> | undefined | void> = ResponseREST<T> &
  Record<string, unknown>;

export const response = {
  [HttpStatusCode.Ok]: <T extends Partial<object> | undefined | void>(
    payload: ResponsePayload<T>,
  ) => {
    const { code, message, data, ...rest } = payload;
    return NextResponse.json(
      {
        code: code || HttpStatusCode.Ok,
        message: message || 'Success!',
        data,
        ...rest,
      },
      { status: HttpStatusCode.Ok },
    );
  },
  [HttpStatusCode.Created]: <T extends Partial<object> | undefined | void>(
    payload: ResponsePayload<T>,
  ) => {
    const { code, message, data, ...rest } = payload;
    return NextResponse.json(
      {
        code: code || HttpStatusCode.Created,
        message: message || 'Successfully created!',
        data,
        ...rest,
      },
      { status: HttpStatusCode.Created },
    );
  },
  [207]: <T extends Partial<object> | undefined | void>({
    code,
    message,
    data,
  }: ResponseREST<T>) => {
    return NextResponse.json(
      {
        code: code || 207,
        message: message || 'Partial success',
        data,
      },
      { status: 207 },
    );
  },
  [HttpStatusCode.BadRequest]: <T extends Partial<object> | undefined | void>({
    code,
    message,
    data,
  }: ResponseREST<T>) => {
    return NextResponse.json(
      {
        code: code || HttpStatusCode.BadRequest,
        message: message || 'Invalid!',
        data,
      },
      { status: HttpStatusCode.BadRequest },
    );
  },
  [HttpStatusCode.Unauthorized]: <T extends Partial<object> | undefined | void>({
    code,
    message,
    data,
  }: ResponseREST<T>) => {
    return NextResponse.json(
      {
        code: code || HttpStatusCode.Unauthorized,
        message: message || 'Unauthorized!',
        data,
      },
      { status: HttpStatusCode.Unauthorized },
    );
  },
  [HttpStatusCode.Forbidden]: <T extends Partial<object> | undefined | void>({
    code,
    message,
    data,
  }: ResponseREST<T>) => {
    return NextResponse.json(
      {
        code: code || HttpStatusCode.Forbidden,
        message: message || 'Failed!',
        data,
      },
      { status: HttpStatusCode.Forbidden },
    );
  },
  [HttpStatusCode.NotFound]: <T extends Partial<object> | undefined | void>({
    code,
    message,
    data,
  }: ResponseREST<T>) => {
    return NextResponse.json(
      {
        code: code || HttpStatusCode.NotFound,
        message: message || 'Not found!',
        data,
      },
      { status: HttpStatusCode.NotFound },
    );
  },
  [HttpStatusCode.InternalServerError]: <T extends Partial<object> | undefined | void>(
    payload?: ResponseREST<T>,
  ) => {
    return NextResponse.json(
      {
        code: HttpStatusCode.InternalServerError,
        message: payload?.message || validationMessage()[500],
      },
      { status: HttpStatusCode.InternalServerError },
    );
  },
  handler: <T extends Partial<object> | undefined | void>(payload: ResponseREST<T>) => {
    const code = Number(payload?.code || payload?.statusCode || payload?.status);

    if (code && !isNaN(code)) {
      switch (code) {
        case HttpStatusCode.Ok:
          return response[HttpStatusCode.Ok](payload);
        case HttpStatusCode.Created:
          return response[HttpStatusCode.Created](payload);
        case 207:
          return response[207](payload);
        case HttpStatusCode.BadRequest:
          return response[HttpStatusCode.BadRequest](payload);
        case HttpStatusCode.Unauthorized:
          return response[HttpStatusCode.Unauthorized](payload);
        case HttpStatusCode.Forbidden:
          return response[HttpStatusCode.Forbidden](payload);
        case HttpStatusCode.NotFound:
          return response[HttpStatusCode.NotFound](payload);
        case HttpStatusCode.InternalServerError:
          return response[HttpStatusCode.InternalServerError](payload);
        default:
          if (code >= 200 && code < 300) {
            return response[HttpStatusCode.Ok](payload);
          }
          return response[HttpStatusCode.BadRequest](payload);
      }
    }

    return response[HttpStatusCode.Ok]({
      ...payload,
      code: HttpStatusCode.Ok,
    });
  },
};
