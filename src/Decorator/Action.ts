import { ActionRoute } from "../Route";
import * as Hapi from "hapi";
import { HapiServiceProvider } from "../HapiServiceProvider";


export interface ActionDecoratorConfiguration {

    method?: Hapi.HTTP_METHODS_PARTIAL;
}

export function action(path: string, configuration: ActionDecoratorConfiguration = {}) {

    // tslint:disable-next-line:only-arrow-functions
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<any>) {

        // ToDo: Detect when it's a function and bind differently

        const constructor = target.constructor;

        const route: ActionRoute = {
            path,
            actionObject: constructor,
            method: configuration.method,
            actionMethod: key,
        };

        const routes = Reflect.getMetadata(`protoculture-hapi:routes`, constructor) || [];

        routes.push(route);

        Reflect.defineMetadata(`protoculture-hapi:routes`, routes, constructor);

        // ToDo: https://github.com/rbuckton/reflect-metadata/issues/70
        HapiServiceProvider.routedTargets.push(constructor);
    };
}
