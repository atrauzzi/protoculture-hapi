import * as Chance from "chance";


export function actionName(name?: string) {

    // tslint:disable-next-line:only-arrow-functions
    return function (target: any) {

        findOrAddActionName(target, name);
    };
}

export function findOrAddActionName(target: any, name?: string) {

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
