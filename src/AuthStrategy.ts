import { interfaces } from "inversify";
import { OptionsOrFactory } from "./OptionsOrFactory";


export interface AuthStrategyOptions<ProviderOptions = any> {

    name: string;
    scheme: string;
    options?: ProviderOptions;
}

export type AuthStrategy<ProviderOptions = any> = OptionsOrFactory<AuthStrategyOptions>;
