#!/usr/bin/env ts-node
import * as Hapi from "hapi";
import { ServiceProvider, StaticServiceProvider, BaseApp, Suite, ConsoleServiceProvider } from "protoculture";
import { InertServiceProvider, HapiServiceProvider, Route, RouteType } from "../src/index";


const hapiDemoSymbols = {
    HelloController: Symbol("hello"),
}

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

        this.makeInjectable(HelloController);
        this.bindConstructor(hapiDemoSymbols.HelloController, HelloController);

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
                // Can be a function or a class
                actionSymbol: hapiDemoSymbols.HelloController,
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

        super.boot();
    }
}

//
// Here's a suite that acts as the composition root for the entire solution.
class HapiDemoSuite extends Suite {

    public name = "hapi-demo";

    protected get serviceProviders(): StaticServiceProvider<any>[] {

        return [
            ConsoleServiceProvider,
            HapiServiceProvider,
            InertServiceProvider,
            HapiDemoServiceProvider,
        ];
    }
}

//
// And this is how we start it!
const suite = new HapiDemoSuite();
suite.run().catch((error) => console.error(error));
