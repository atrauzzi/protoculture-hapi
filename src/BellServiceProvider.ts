import * as bell from "bell";
import { ServiceProvider } from "protoculture";
import { hapiSymbols } from "./index";


export class BellServiceProvider extends ServiceProvider {

    public async boot() {

        this.bundle.container.bind(hapiSymbols.Plugin)
            .toConstantValue(bell);
    }
}
