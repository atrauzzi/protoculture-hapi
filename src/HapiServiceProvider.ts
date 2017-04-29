import * as _ from "lodash";
import * as Hapi from "hapi";
import { hapiSymbols } from "./index";
import { interfaces } from "inversify";
import { ServiceProvider } from "protoculture";
import { StaticRoute, Route } from "./Route";
import { Dispatcher } from "./Dispatcher";
import { HapiApp } from "./HapiApp";


export class HapiServiceProvider extends ServiceProvider {

    public async boot() {

        this.suite.container.bind(hapiSymbols.Server)
            .toDynamicValue((context) => {
                
                let server: Hapi.Server;

                try {
                    
                    const configuration = context.container.get<Hapi.IServerOptions>(hapiSymbols.ServerOptions);                    
                    server = new Hapi.Server(configuration);
                }
                catch(error) {

                    server = new Hapi.Server();
                }

                const connections = context.container.getAll<Hapi.IServerConnectionOptions>(hapiSymbols.ServerConnectionOptions);
                
                _.each(connections, (connection) => server.connection(connection));

                return server;
            })
            .inSingletonScope();

        this.bindApp(HapiApp);
        this.bindConstructorParameter(hapiSymbols.Server, HapiApp, 0);
        this.bindConstructorParameter([hapiSymbols.Route], HapiApp, 1);
    }

    protected bindRoutes(routes: Route[]) {

        _.each(routes, (route) => this.bindRoute(route));
    }

    protected bindRoute(route: Route) {

        //this.makeInjectable(route);

        this.suite.container.bind(hapiSymbols.Route)
            .toConstantValue(route);
    }

    protected bindConnection(connection: Hapi.IServerConnectionOptions) {

        this.suite.container.bind(hapiSymbols.ServerConnectionOptions)
            .toConstantValue(connection);
    }
}