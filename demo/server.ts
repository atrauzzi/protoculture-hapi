#!/usr/bin/env ts-node
import { ServiceProvider, StaticServiceProvider, BaseApp, Suite, ConsoleServiceProvider } from "protoculture";
import { HapiServiceProvider, Route } from "../src/index";
import * as Hapi from "hapi";

const hapiDemoSymbols = {
    HelloController: Symbol("hello"),
}

export class HelloController {
    
    // Controllers can be async now!
    public async sayHello(request: Hapi.Request, reply: Hapi.IReply, route: Route) {

        reply("Hello!");
    }
}

class HapiDemoServiceProvider extends HapiServiceProvider {

    public async boot() {

        this.bindConnection({
            host: "0.0.0.0",
            port: 2112,
        });

        this.makeInjectable(HelloController);
        this.bindConstructor(hapiDemoSymbols.HelloController, HelloController);

        // Routes obviously don't have to be inline, they can come from other modules still!
        this.bindRoutes([
            {
                // Standard hapi route configuration still in play!
                path: "/",
                method: "GET",
                // Can be a function or a class
                actionSymbol: hapiDemoSymbols.HelloController,
                // If a class is used, the method to invoke
                actionMethod: "sayHello",
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
            HapiDemoServiceProvider,
            ConsoleServiceProvider,
        ];
    }
}

//
// And this is how we start it!
const suite = new HapiDemoSuite();
suite.run().catch(console.error);