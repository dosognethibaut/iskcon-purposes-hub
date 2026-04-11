import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const pinoHttp = require("pino-http") as typeof import("pino-http").default;

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: Request) {
        return {
          id: (req as Request & { id?: string }).id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: Response) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.use("/api", router);

export default app;
