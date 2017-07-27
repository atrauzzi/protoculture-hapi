import * as _ from "lodash";
import * as Hapi from "hapi";
import * as Catbox from "catbox";
import "./Extensions";
import { symbols } from "protoculture";
import { hapiSymbols } from "./index";
import { interfaces } from "inversify";
import { ServiceProvider } from "protoculture";
import { RouteType } from "./Route";
import { Dispatcher } from "./Dispatcher";
import { HapiApp } from "./HapiApp";
import { OptionsOrFactory } from "./OptionsOrFactory";
import { AuthStrategy, AuthStrategyOptions } from "./AuthStrategy";


export class HapiServiceProvider extends ServiceProvider {

    public static readonly routedTargets: any[] = [];

    public async boot() {

        this.bundle.container.bind(hapiSymbols.Server)
            .toDynamicValue((context) => {

                const server = this.createServer(context);
                this.initializeConnections(server, context);
                this.initializePlugins(server, context);
                this.initializeAuthStrategies(server, context);

                return server;
            })
            .inSingletonScope();

        this.bindApp(HapiApp);
        this.bindConstructorParameter(hapiSymbols.Server, HapiApp, 0);
        this.bindConstructorParameter([hapiSymbols.Route], HapiApp, 1);

        this.configureDecoratedRoutes();
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

        try {

            configurationOptions.cache = context.container.getAll(hapiSymbols.Cache);
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

            connections = [
                {
                    host: "0.0.0.0",
                    port: 80,
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

    private initializeAuthStrategies(server: Hapi.Server, context: interfaces.Context) {

        try {

            const strategies = context.container.getAll<AuthStrategy>(hapiSymbols.AuthStrategy);
            _.each(strategies, (strategyOrFactory) => {

                const strategy = this.resolveOptions(context.container, strategyOrFactory);

                server.auth.strategy(strategy.name, strategy.scheme, strategy.options);
            });
        }
        catch (error) {

            // Pass
        }
    }

    private configureDecoratedRoutes() {

        const routes = _.chain(HapiServiceProvider.routedTargets)
            .map((target) => _.values(Reflect.getMetadata("protoculture-hapi:routes", target)))
            .flatten()
            .value();

        this.configureRoutes(routes);
    }

    private resolveOptions<Options>(container: interfaces.Container, optionsOrFactory: OptionsOrFactory<Options>): Options {

        return _.isFunction(optionsOrFactory)
            ? optionsOrFactory(container)
            : optionsOrFactory as Options;
    }
}
