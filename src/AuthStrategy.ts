

export interface AuthStrategy<ProviderOptions = any> {

    provider: string;
    scheme: string;
    options?: ProviderOptions;
}
