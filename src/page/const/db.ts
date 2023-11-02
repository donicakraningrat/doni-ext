export type TDbConfig = {
    name: string;
    host?: string;
    user?: string;
    password?: string;
    port?: number;
    connectTimeout?: number;
};

export const initDbConfig: TDbConfig =
{
    name: "",
    host: "",
    user: "",
    password: "",
    port: 3306,
    connectTimeout: 30000,
}