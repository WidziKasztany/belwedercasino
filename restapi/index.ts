import Express from "express";
import { ApiRouter } from "./api/ApiRouter";

const api = Express();
api.use("/api", ApiRouter);
api.listen(8080, () => console.log(`RestAPI Listening on port 8080`));
