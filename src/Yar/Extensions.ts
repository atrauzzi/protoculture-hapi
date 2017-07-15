import { ServiceProvider } from "protoculture";
import { YarOptions } from "yar";
import { hapiSymbols } from "../index";


declare module "protoculture/lib/ServiceProvider" {

    export interface ServiceProvider {

        configureSession(options: YarOptions): void;
    }
}

ServiceProvider.prototype.configureSession = function (options: YarOptions) {

    this.bundle.container.bind(hapiSymbols.SessionOptions)
        .toConstantValue(options);
};
