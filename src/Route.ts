import * as Hapi from "hapi";


export interface StaticRoute<RouteType extends Route> {

    new(...args: any[]): RouteType;
}

export interface Route {

    path: string;
    method?: string;
    actionSymbol: symbol;
    actionMethod?: string;

    hapiRouteConfiguration?: Hapi.IRouteConfiguration;
}
