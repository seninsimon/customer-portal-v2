import { Method, ResponseType  } from "axios";

export interface BaseServiceParams<TRequest> {
    method: Method;
    url: string;
    data?: TRequest;
    headers?: Record<string, string>;
    skipTokenCheck?: boolean;
    responseType? : ResponseType

}