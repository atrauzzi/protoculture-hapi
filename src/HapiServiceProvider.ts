import * as _ from "lodash";
import * as Hapi from "hapi";
import { hapiSymbols } from "./index";
import { interfaces } from "inversify";
import { ServiceProvider } from "protoculture";
import { RouteType } from "./Route";
import { Dispatcher } from "./Dispatcher";
import { HapiApp } from "./HapiApp";


export class HapiServiceProvider extends ServiceProvider {

    public async boot() {

        this.suite.container.bind(hapiSymbols.Server)
            .toDynamicValue((context) => {
                
                const server = this.createServer(context);
                this.configurePlugins(server, context);
                this.configureConnections(server, context);

                return server;
            })
            .inSingletonScope();

        this.bindApp(HapiApp);
        this.bindConstructorParameter(hapiSymbols.Server, HapiApp, 0);
        this.bindConstructorParameter([hapiSymbols.Route], HapiApp, 1);
    }

    protected bindRoutes(routes: RouteType[]) {

        _.each(routes, (route) => this.bindRoute(route));
    }

    protected bindRoute(route: RouteType) {

        this.suite.container.bind(hapiSymbols.Route)
            .toConstantValue(route);
    }

    protected bindConnection(connection: Hapi.IServerConnectionOptions) {

        this.suite.container.bind(hapiSymbols.ServerConnectionOptions)
            .toConstantValue(connection);
    }

    private createServer(context: interfaces.Context) {

        const configurationOptions: Hapi.IServerOptions = {
            connections: {
                router: {
                    stripTrailingSlash: true,
                    isCaseSensitive: true,
                }
            }
        };

        try {
            
            const configuredOptions = context.container.get<Hapi.IServerOptions>(hapiSymbols.ServerOptions);
            _.assign(configurationOptions, configuredOptions);
        }
        catch(error) {

        }

        return new Hapi.Server(configurationOptions);
    }

    private configureConnections(server: Hapi.Server, context: interfaces.Context) {

        const connections = context.container.getAll<Hapi.IServerConnectionOptions>(hapiSymbols.ServerConnectionOptions);
        
        _.each(connections, (connection) => server.connection(connection));
    }

    private configurePlugins(server: Hapi.Server, context: interfaces.Context) {

        try {
            
            const plugins = context.container.getAll<any>(hapiSymbols.Plugin);
            _.each(plugins, (plugin) => server.register(plugin))
        }
        catch(error) {

        }
    }
}