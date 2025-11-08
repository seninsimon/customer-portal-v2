import { ERRORS } from '@/constants/errors.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage.constants';
import { axiosConfig } from './axios.config';
import { AccessTokenResponse } from './types/access-token/access-token.response';
import { AccessTokenRequest } from './types/access-token/access-token.request';
import { BaseServiceParams } from './types/base-service/base-service.params';

export async function baseService<TResponse, TRequest>({ method, url, data, headers, skipTokenCheck = false , responseType }: BaseServiceParams<TRequest>): Promise<TResponse> {
    if (skipTokenCheck) {
        return await axiosConfig<TResponse, TRequest>({ method, url, data, headers });
    }

    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

    if (accessToken) {
        return await axiosConfig<TResponse, TRequest>({ method, url, data, headers: { ...headers, Authorization: `Bearer ${accessToken}` },responseType });
    } else if (refreshToken) {
        const data = {
            refreshToken
        }
        const tokens = await axiosConfig<AccessTokenResponse, AccessTokenRequest>({ method, url: "/auth/refresh", data, headers: { ...headers, Authorization: `Bearer ${refreshToken}` } });
        const accessToken = tokens.data.accessToken;
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        return await baseService({ method, url, data, headers: { ...headers, Authorization: `Bearer ${accessToken}` } });
    } else {
        throw new Error(ERRORS.SESSION_TIMEOUT)
    }
}