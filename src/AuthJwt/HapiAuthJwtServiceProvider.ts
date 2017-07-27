import "./Extensions";
import { ServiceProvider } from "protoculture";


export class HapiAuthJwtServiceProvider extends ServiceProvider {

    public async boot() {

        this.bindHapiAuthJwt();
    }
}
