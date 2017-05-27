import * as _ from "lodash";
import * as Hapi from "hapi";
import { App, Bundle, LogLevel } from "protoculture";
import { Dispatcher } from "./Dispatcher";
import { Route } from "./Route";
import { toCommonLogFormat } from "./CommonLogFormatter";


export class HapiApp implements App {

    public get name() {

        return "hapi";
    }

    public get working(): boolean {

        return true;
    }

    public bundle: Bundle;

    protected dispatcher: Dispatcher;

    public constructor(
        protected server: Hapi.Server,
        protected routes: Route[],
    ) {

        this.dispatcher = new Dispatcher(this, this.server);

        this.server.on("log", (request: Hapi.Request, event: Event) => this.log(event, LogLevel.Info));
        this.server.on("request-error", (request: Hapi.Request, error: Error) => this.logError(request, error));
        this.server.on("request", (request: Hapi.Request, event: Event) => this.logRequest(request, event));
        this.server.on("response", (request: Hapi.Request) => this.logResponse(request));

        this.dispatcher.registerRoutes(this.routes);
    }

    public async run(): Promise<void> {

        const connections = _.map(this.server.connections, (connection) =>
            ` - ${connection.info.host}:${connection.info.port}`);

        this.log("Listening via: \n" + connections.join("\n"));

        this.server.start();
    }

    protected logRequest(request: Hapi.Request, event: Event) {

        this.log(event, LogLevel.Info);
    }

    protected logResponse(request: Hapi.Request) {

        this.log(toCommonLogFormat(request), LogLevel.Info);
    }

    protected logError(request: Hapi.Request, error: Error) {

        this.log(error, LogLevel.Error);
    }

    protected log(message: any, level?: LogLevel) {

        this.bundle.logger.log(message, this, level);
    }
}
