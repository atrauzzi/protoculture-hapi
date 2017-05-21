import * as _ from "lodash";
import * as Hapi from "hapi";
import "./Extensions";
import { symbols } from "protoculture";
import { hapiSymbols } from "./index";
import { interfaces } from "inversify";
import { ServiceProvider, Environment } from "protoculture";
import { RouteType } from "./Route";
import { Dispatcher } from "./Dispatcher";
import { HapiApp } from "./HapiApp";


export class HapiServiceProvider extends ServiceProvider {

    public async boot() {

        this.suite.container.bind(hapiSymbols.Server)
            .toDynamicValue((context) => {

                const server = this.createServer(context);
                this.initializePlugins(server, context);
                this.initializeConnections(server, context);

                return server;
            })
            .inSingletonScope();

        this.bindApp(HapiApp);
        this.bindConstructorParameter(hapiSymbols.Server, HapiApp, 0);
        this.bindConstructorParameter([hapiSymbols.Route], HapiApp, 1);
    }

    private createServer(context: interfaces.Context) {

        const configurationOptions: Hapi.ServerOptions = {
            connections: {
                router: {
                    stripTrailingSlash: true,
                    isCaseSensitive: true,
                }
            }
        };

        try {

            const configuredOptions = context.container.get<Hapi.ServerOptions>(hapiSymbols.ServerOptions);
            _.assign(configurationOptions, configuredOptions);
        }
        catch (error) {
            // Pass
        }

        return new Hapi.Server(configurationOptions);
    }

    private initializeConnections(server: Hapi.Server, context: interfaces.Context) {

        let connections: Hapi.ServerConnectionOptions[];

        try {

            connections = context.container.getAll<Hapi.ServerConnectionOptions>(hapiSymbols.ServerConnectionOptions);
        }
        catch (error) {

            const environment = context.container.get<Environment>(symbols.Environment);

            connections = [
                {
                    host: environment.host,
                    port: environment.port,
                }
            ];
        }

        _.chain(connections)
            .uniqBy(_.isEqual)
            .each((connection) => server.connection(connection))
            .value();
    }

    private initializePlugins(server: Hapi.Server, context: interfaces.Context) {

        try {

            const plugins = context.container.getAll<any>(hapiSymbols.Plugin);
            _.each(plugins, (plugin) => server.register(plugin));
        }
        catch (error) {
            // Pass
        }
    }
}
