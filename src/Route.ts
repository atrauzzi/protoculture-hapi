import * as Hapi from "hapi";


export type RouteType = 
    Route 
    | ActionRoute 
    | DirectoryRoute 
    | FileRoute 
    | Hapi.IRouteConfiguration
;

export interface StaticRoute<RouteType extends Route> {

    new(...args: any[]): RouteType;
}

export interface Route {

    method?: string;
}

export interface ActionRoute extends Route {

    path: string;    
    actionSymbol: symbol;
    actionMethod?: string;
}

export interface DirectoryRoute extends Route {

    path?: string;
    directory: string;
}

export interface FileRoute extends Route {

    path?: string;
    file: string;    
}