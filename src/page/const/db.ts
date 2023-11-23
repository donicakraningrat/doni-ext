export type TDbConfig = {
    host?: string;
    user?: string;
    password?: string;
    port?: number;
    connectTimeout?: number;
};
export type TJwtConfig = {

    secretKey?: string;
    algorithm?: string;
    expiredDate?: string;
};
export const initConfig: TConfig =
{
    name: "",
    dbConfig: {
        host: "",
        user: "",
        password: "",
        port: 3306,
        connectTimeout: 30000,
    },
    jwtConfig: {
        secretKey: "",
        algorithm: "",
        expiredDate: ""
    }
}
export type TConfig = {
    name: string;
    dbConfig: TDbConfig;
    jwtConfig: TJwtConfig;
}