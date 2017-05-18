import * as Hapi from "hapi";
import { Route } from "./Route";


export interface Handler {

    (request: Hapi.Request, reply: Hapi.Base_Reply, route: Route): Promise<void>;
}
