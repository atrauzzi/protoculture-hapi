import * as _ from "lodash";
import * as Hapi from "hapi";
import { interfaces } from "inversify";
import { hapiSymbols } from "./index";
import { RouteType } from "./Route";
import { ServiceProvider } from "protoculture/lib/ServiceProvider";


declare module "protoculture/lib/ServiceProvider" {

    export interface ServiceProvider {

        configureConnection(connectionFactory: ConnectionFactory): void;

        configureRoutes(routes: RouteType[]): void;

        configureRoute(route: RouteType): void;
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
