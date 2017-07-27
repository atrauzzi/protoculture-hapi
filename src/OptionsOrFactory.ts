import { interfaces } from "inversify";


export type OptionsOrFactory<Options = any> = OptionsFactory<Options> | Options;

export type OptionsFactory<Options = any> = (container: interfaces.Container) => Options;
