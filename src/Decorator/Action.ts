import * as Hapi from "hapi";
import * as Chance from "chance";
import { ActionRoute } from "../Route";
import { HapiServiceProvider } from "../HapiServiceProvider";


export interface ActionDecoratorConfiguration {

    name?: string;
    method?: Hapi.HTTP_METHODS_PARTIAL;
}

export function action(path: string, configuration: ActionDecoratorConfiguration = {}) {

    // tslint:disable-next-line:only-arrow-functions
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<any>) {

        // ToDo: Detect when it's a function and bind differently

        const name = findOrAddActionName(target, configuration.name);

        const constructor = target.constructor;

        const route: ActionRoute = {
            name,
            path,
            actionObject: constructor,
            method: configuration.method,
            actionMethod: key,
        };

        const routes = Reflect.getMetadata(`protoculture-hapi:routes`, constructor) || {};

        routes[name] = route;

        Reflect.defineMetadata(`protoculture-hapi:routes`, routes, constructor);

        // ToDo: https://github.com/rbuckton/reflect-metadata/issues/70
        HapiServiceProvider.routedTargets.push(constructor);
    };
}

function findOrAddActionName(target: any, name?: string) {

    const names = Reflect.getMetadata("protoculture-hapi:route-names", target) as string[] || [];

    if (name) {

        names.push(name);
    }

    if (!names.length) {

        names.push((new Chance()).guid());
    }

    Reflect.defineMetadata("protoculture-hapi:route-names", target, names);

    return name || names[0];
}
