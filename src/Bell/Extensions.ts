import { ServiceProvider } from "protoculture";
import { hapiSymbols } from "../index";
import { AuthStrategy } from "./AuthStrategy";


declare module "protoculture/lib/ServiceProvider" {

    export interface ServiceProvider {

        configureAuthStrategy(authStrategy: AuthStrategy): void;
    }
}

ServiceProvider.prototype.configureAuthStrategy = function (strategy: AuthStrategy) {

    this.bundle.container.bind(hapiSymbols.AuthStrategy)
        .toConstantValue(strategy);
};
