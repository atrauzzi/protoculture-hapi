import "./Extensions";


export { HapiServiceProvider } from "./HapiServiceProvider";
export { InertServiceProvider } from "./InertServiceProvider";
export { YarServiceProvider } from "./YarServiceProvider";
export { BellServiceProvider } from "./BellServiceProvider";
export { AuthStrategy } from "./AuthStrategy";
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
    AuthStrategy: Symbol("AuthStrategy"),
};

export { action } from "./Decorator/Action";
