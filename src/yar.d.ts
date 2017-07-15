

declare module "yar" {

    export interface YarOptions {

        storeBlank: boolean;

        cookieOptions: YarCookieOptions;
    }

    export interface YarCookieOptions {
        
        password: string;

        isSecure: boolean;
    }
}
