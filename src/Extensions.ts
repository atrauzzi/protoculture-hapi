import * as _ from "lodash";
import * as Hapi from "hapi";
import { interfaces } from "inversify";
import { ServiceProvider } from "protoculture";
import { YarOptions } from "yar";
import { hapiSymbols } from "./index";
import { RouteType } from "./Route";
import { AuthStrategy } from "./AuthStrategy";


declare module "protoculture/lib/ServiceProvider" {

    export interface ServiceProvider {

        configureConnection(connectionFactory: ConnectionFactory): void;

        configureRoutes(routes: RouteType[]): void;

        configureRoute(route: RouteType): void;

        configureSession(options: YarOptions): void;

        configureAuthStrategy(authStrategy: AuthStrategy): void;
    }
}

export type ConnectionFactory = (container: interfaces.Container) => Hapi.ServerConnectionOptions;

ServiceProvider.prototype.configureConnection = function (connectionFactory: ConnectionFactory) {

    const connection = connectionFactory(this.bundle.container);

    this.bundle.container.bind(hapiSymbols.ServerConnectionOptions)
        .toConstantValue(connection);
};

ServiceProvider.prototype.configureRoutes = function (routes: RouteType[]) {

    _.each(routes, (route) => this.configureRoute(route));
};

ServiceProvider.prototype.configureRoute = function (route: RouteType) {

    this.bundle.container.bind(hapiSymbols.Route)
        .toConstantValue(route);
};

ServiceProvider.prototype.configureSession = function (options: YarOptions) {

    this.bundle.container.bind(hapiSymbols.SessionOptions)
        .toConstantValue(options);
};

ServiceProvider.prototype.configureAuthStrategy = function (strategy: AuthStrategy) {

    this.bundle.container.bind(hapiSymbols.AuthStrategy)
        .toConstantValue(strategy);
};
