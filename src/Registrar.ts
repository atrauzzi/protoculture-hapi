import * as _ from "lodash";
import * as Hapi from "hapi";
import { App } from "protoculture/lib";
import { Dispatcher } from "./Dispatcher";
import { Route, ActionRoute, DirectoryRoute, FileRoute } from "./Route";
import { decorate, injectable, Container } from "inversify";


export class Registrar {

    public constructor(
        protected container: Container,
        protected server: Hapi.Server,
        protected dispatcher: Dispatcher
    ) {

    }

    public registerRoutes(routes: Route[]) {

        _.each(routes, (route) => this.registerRoute(route));
    }

    public registerRoute(route: Route | Hapi.RouteConfiguration) {

        if (_.has(route, "actionObject")) {

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

        const symbol = this.bindAction(route);

        // Note: Apparently you can't use fat arrow functions for handlers in hapi.
        const dispatcher = this.dispatcher;
        // tslint:disable-next-line:only-arrow-functions
        const actionHandler = function (request: Hapi.Request, reply: Hapi.Base_Reply) {

            dispatcher.dispatch(request, reply, route, symbol);
        };

        this.registerHapiRoute({
            path: route.path,
            method: route.method || "GET",
            // Note: Keeping this closure as lightweight as possible.
            handler: actionHandler,
        });
    }

    protected bindAction(route: ActionRoute) {

        const actionSymbol = Symbol(`${route.method}#${route.path}`);

        decorate(injectable(), route.actionObject);

        const bind = this.container
            .bind(actionSymbol)
            .to(route.actionObject)
            .inTransientScope();

        return actionSymbol;
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
}
