

declare module "yar" {

    export interface YarOptions {

        storeBlank: boolean;

        cookieOptions: YarCookieOptions;
    }

    export interface YarCookieOptions {
        
        password: string;

        isSecure: boolean;

        isHttpOnly: boolean;

        ttl: number|null;

        path: string;

        isSameSite: "Strict" | "Lax" | false;
    }
}
