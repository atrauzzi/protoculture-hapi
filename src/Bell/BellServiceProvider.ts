import "./Extensions";
import { ServiceProvider } from "protoculture";


export class BellServiceProvider extends ServiceProvider {

    public async boot() {

        this.bindBell();
    }
}
