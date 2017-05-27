import * as _ from "lodash";
import * as Hapi from "hapi";
import { Bundle, App, LogLevel } from "protoculture";
import { Route, ActionRoute, DirectoryRoute, FileRoute } from "./Route";
import { Handler } from "./Handler";


export class Dispatcher {

    public constructor(
        protected app: App,
        protected server: Hapi.Server,
    ) {

    }

    public registerRoutes(routes: Route[]) {

        _.each(routes, (route) => this.registerRoute(route));
    }

    public registerRoute(route: Route | Hapi.RouteConfiguration) {

        if (_.has(route, "actionSymbol")) {

            this.registerActionRoute(route as ActionRoute);
        }
        else if (_.has(route, "directory")) {

            this.registerDirectoryRoute(route as DirectoryRoute);
        }
        else if (_.has(route, "file")) {

            this.registerFileRoute(route as FileRoute);
        }
        else {

            this.registerHapiRoute(route as Hapi.RouteConfiguration);
        }
    }

    protected registerActionRoute(route: ActionRoute) {

        // Note: Apparently you can't use fat arrow functions for handlers in hapi.
        const dispatcher = this;
        // tslint:disable-next-line:only-arrow-functions
        const actionHandler = function (request: Hapi.Request, reply: Hapi.Base_Reply) {

            dispatcher
                .dispatch(request, reply, route)
                .catch((error) => dispatcher.error(error, request, reply, route));
        };

        this.registerHapiRoute({
            path: route.path,
            method: route.method || "GET",
            // Note: Keeping this closure as lightweight as possible.
            handler: actionHandler,
        });
    }

    protected registerDirectoryRoute(route: DirectoryRoute) {

        this.registerHapiRoute({
            method: route.method || "GET",
            path: route.path || "/{path*}",
            handler: {
                directory: {
                    path: route.directory,
                    index: true,
                },
            },
        });
    }

    protected registerFileRoute(route: FileRoute) {

        this.registerHapiRoute({
            method: route.method || "GET",
            path: route.path || "/{path*}",
            handler: {
                file: route.file,
            },
        });
    }

    protected registerHapiRoute(route: Hapi.RouteConfiguration) {

        this.server.route(route);
    }

    // Note: This is the root async context.
    protected async dispatch(request: Hapi.Request, reply: Hapi.Base_Reply, route: ActionRoute) {

        const childContainer = await this.app.bundle.bootChild();

        const actionTarget = childContainer.get(route.actionSymbol);
        const action: Handler = actionTarget[route.actionMethod] || actionTarget;

        await action(request, reply, route);
    }

    protected error(error: any, request: Hapi.Request, reply: Hapi.Base_Reply, route: Route) {

        if (_.isError(error)) {

            const {name, message, stack} = error;
            request.log(["error", "uncaught"], {name, message, stack});
        }
        else {

            request.log(["error", "uncaught"], {name: "Error", message: error});
            error = new Error(error);
        }

        reply(error);
    }
}
