import "./Extensions";


export { HapiServiceProvider } from "./HapiServiceProvider";
export { InertServiceProvider } from "./InertServiceProvider";
export { YarServiceProvider } from "./YarServiceProvider";
export { RouteType, Route, ActionRoute, DirectoryRoute, FileRoute } from "./Route";
export { Handler } from "./Handler";

export const hapiSymbols = {
    ServerOptions: Symbol("HapiServerOptions"),
    ServerConnectionOptions: Symbol("HapiServerConnectionOptions"),
    SessionOptions: Symbol("HapiSessionOptions"),
    Server: Symbol("HapiServer"),
    Route: Symbol("HapiRoute"),
    Cache: Symbol("HapiCache"),
    Plugin: Symbol("HapiPlugin"),
};

export { action } from "./Decorator/Action";
