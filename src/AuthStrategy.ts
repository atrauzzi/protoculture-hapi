export interface AuthStrategy<ProviderOptions = any> {

    name: string;
    scheme: string;
    options?: ProviderOptions;
}
