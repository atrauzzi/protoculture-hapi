import * as Inert from "inert";
import { hapiSymbols } from "./index";
import { ServiceProvider } from "protoculture";


export class InertServiceProvider extends ServiceProvider {

    public async boot() {

        this.suite.container.bind(hapiSymbols.Plugin)
            .toConstantValue(Inert);
    }
}
