import * as Hapi from "hapi";
import * as Chance from "chance";
import { ActionRoute } from "../Route";
import { HapiServiceProvider } from "../HapiServiceProvider";
import { findOrAddActionName } from "./ActionName";


export function action(path: string, method?: Hapi.HTTP_METHODS_PARTIAL, name?: string) {

    // tslint:disable-next-line:only-arrow-functions
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<any>) {

        // ToDo: Detect when it's a function and bind differently

        name = findOrAddActionName(target, name);

        const constructor = target.constructor;

        const route: ActionRoute = {
            name,
            path,
            method,
            actionObject: constructor,
            actionMethod: key,
        };

        const routes = Reflect.getMetadata(`protoculture-hapi:routes`, constructor) || {};

        routes[name] = route;

        Reflect.defineMetadata(`protoculture-hapi:routes`, routes, constructor);

        // ToDo: https://github.com/rbuckton/reflect-metadata/issues/70
        HapiServiceProvider.routedTargets.push(constructor);
    };
}
