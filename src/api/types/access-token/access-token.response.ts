export interface AccessTokenResponse {
    data: Data;
    statusCode: number;
    message: string;
    metadata: string;
}

export interface Data {
    accessToken: string;
    refreshToken: string;
    userId: string;
}
