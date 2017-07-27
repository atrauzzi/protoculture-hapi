import * as inversify from "inversify";
import * as hapiAuthJwt2 from "hapi-auth-jwt2";
import { ServiceProvider as ServiceProvider } from "protoculture";
import { hapiSymbols } from "../index";
import { AuthStrategy } from "../AuthStrategy";


declare module "protoculture/lib/ServiceProvider" {

    export interface ServiceProvider {

        configureHapiAuthJwt(strategy: AuthStrategy<hapiAuthJwt2.Options>): void;
        bindHapiAuthJwt(): void;
    }
}

ServiceProvider.prototype.configureHapiAuthJwt = function (strategy: AuthStrategy<hapiAuthJwt2.Options>) {

    this.configureAuthStrategy(strategy);
};

ServiceProvider.prototype.bindHapiAuthJwt = function () {

    this.bundle.container.bind(hapiSymbols.Plugin)
        .toConstantValue(hapiAuthJwt2);
};
