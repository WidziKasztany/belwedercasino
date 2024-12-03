import { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { DataBaseManager } from "../database/DataBaseManager";

export const ApiRouter = Router();
ApiRouter.use(cors());
ApiRouter.use(bodyParser.json());
ApiRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

async function getRoute(path: string) {
  return ((await import(path)) as any).default;
}

async function registerRoutes() {
  // Some of them should be GET and POST instead of all, but whatever

  // help method
  async function register(path: string) {
    ApiRouter.all(`/${path}`, await getRoute(`./routes/${path}`));
  }

  await register("register");
  await register("login");
  await register("getdata");
  await register("addbalance");
  await register("getcases");
  await register("getdropsdata");
  await register("opencase");
}

registerRoutes();
