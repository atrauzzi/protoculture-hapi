#!/usr/bin/env ts-node
import * as Hapi from "hapi";
import { ServiceProvider, StaticServiceProvider, BaseApp, Bundle, ConsoleServiceProvider } from "protoculture";
import { InertServiceProvider, HapiServiceProvider, Route, RouteType } from "../src/index";


// tslint:disable:max-classes-per-file

export class HelloController {

    // Controllers can be async now!
    public async sayHello(request: Hapi.Request, reply: Hapi.Base_Reply, route: Route) {

        reply("Yes sir I like it!");
    }
}

class HapiDemoServiceProvider extends ServiceProvider {

    public async boot() {

        this.configureConnection(() => {

            return {
                host: "0.0.0.0",
                port: 2112,
            };
        });

        // Duplicate connections don't matter!
        this.configureConnection(() => {

            return {
                host: "0.0.0.0",
                port: 2112,
            };
        });

        // Routes obviously don't have to be inline, they can come from other modules still!
        this.configureRoutes([
            // Static routes, for when you just can't get enough.
            {
                directory: "./demo/public",
            },
            // Action routes!  These are routes that resolve their handler via the IoC!
            {
                path: "/say-hello",
                method: "GET",
                actionObject: HelloController,
                // If a class is used, the method to invoke
                actionMethod: "sayHello",
            },
            // Single files can be served too.
            {
                method: "GET",
                path: "/protoculture.png",
                file: "protoculture.png",
            }
        ]);
    }
}

//
// Here's a bundle that acts as the composition root for the entire solution.
class HapiDemoBundle extends Bundle {

    public name = "hapi-demo";

    protected get serviceProviders(): StaticServiceProvider<any>[] {

        return [
            ConsoleServiceProvider,
            HapiDemoServiceProvider,
            HapiServiceProvider,
            InertServiceProvider,
        ];
    }
}

//
// And this is how we start it!
const bundle = new HapiDemoBundle();
bundle.run().catch(console.error);
