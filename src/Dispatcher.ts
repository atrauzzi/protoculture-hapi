import * as _ from "lodash";
import * as Hapi from "hapi";
import { Suite, App, LogLevel } from "protoculture";
import { Route } from "./Route";
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

    public registerRoute(route: Route | Hapi.IRouteConfiguration) {

        if(_.has(route, "actionSymbol")) {

            this.registerProtocultureRoute(route as Route);
        }
        else {

            this.registerHapiRoute(route as Hapi.IRouteConfiguration);
        }
    }

    protected registerProtocultureRoute(route: Route) {

        // Note: Apparently you can't use fat arrow functions for handlers in hapi.
        const dispatcher = this;
        const handler = function (request: Hapi.Request, reply: Hapi.IReply) {

            dispatcher
                .dispatch(request, reply, route)
                .catch((error) => dispatcher.error(error, request, reply, route));
        };

        this.registerHapiRoute({
            path: route.path,
            method: route.method || "GET",
            handler: handler,
        });
    }

    protected registerHapiRoute(route: Hapi.IRouteConfiguration) {

        this.server.route(route);
    }

    // Note: This is the root async context.
    protected async dispatch(request: Hapi.Request, reply: Hapi.IReply, route: Route) {
        
        const childContainer = await this.app.suite.bootChild();

        const actionTarget = childContainer.get(route.actionSymbol);
        const action: Handler = actionTarget[route.actionMethod] || actionTarget;

        await action(request, reply, route);
    }

    protected error(error: any, request: Hapi.Request, reply: Hapi.IReply, route: Route) {
console.log("something errorful happened", error);
        if(_.isError(error)) {

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