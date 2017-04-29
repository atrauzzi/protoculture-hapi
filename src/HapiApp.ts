import * as _ from "lodash";
import * as Hapi from "hapi";
import { App, Suite } from "protoculture";
import { Dispatcher } from "./Dispatcher";
import { Route } from "./Route";


export class HapiApp implements App {
    
    public get name() {

        return "hapi";
    }

    public get working(): boolean {
        
        return true;
    }

    public suite: Suite;

    protected dispatcher: Dispatcher;

    public constructor(
        protected server: Hapi.Server,
        protected routes: Route[],
    ) {

        this.dispatcher = new Dispatcher(this, this.server);
    }

    public async run(): Promise<void> {
        
        this.dispatcher.registerRoutes(this.routes);

        // ToDo: Tap all the hapi logging events and feed them back up through protoculture.

        this.server.start();
    }
}