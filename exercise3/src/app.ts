import { Server } from "./presentation/server";
import { envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes";

(async ()=>{
await main();
})();

async function main() {

  const server = new Server({
    port :envs.PORT,
    routes: AppRoutes.routes,
  });

  await server.start();

}