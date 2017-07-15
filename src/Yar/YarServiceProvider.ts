import { PluginRegistrationObject } from "hapi";
import { hapiSymbols } from "../index";
import { ServiceProvider } from "protoculture";
import * as yar from "yar";


export class YarServiceProvider extends ServiceProvider {

    public async boot() {

        this.bundle.container.bind(hapiSymbols.Plugin)
            .toDynamicValue((context) => {

                const options = context.container.get<yar.YarOptions>(hapiSymbols.SessionOptions);

                return {
                    register: yar,
                    options,
                } as PluginRegistrationObject<yar.YarOptions>;
            });
    }
}
