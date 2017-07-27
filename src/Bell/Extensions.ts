import * as bell from "bell";
import { ServiceProvider } from "protoculture";
import { hapiSymbols } from "../index";
import { AuthStrategy } from "../AuthStrategy";


declare module "protoculture/lib/ServiceProvider" {

    export interface ServiceProvider {

        configureBell(strategy: AuthStrategy): void;
        bindBell(): void;
    }
}

ServiceProvider.prototype.configureBell = function (strategy: AuthStrategy) {

    this.configureAuthStrategy(strategy);
};

ServiceProvider.prototype.bindBell = function () {

    this.bundle.container.bind(hapiSymbols.Plugin)
        .toConstantValue(bell);
};

