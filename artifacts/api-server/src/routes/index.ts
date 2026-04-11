import { Router, type IRouter } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

if (process.env.DATABASE_URL) {
  const authRouter = require("./auth").default as IRouter;
  const purposesRouter = require("./purposes").default as IRouter;

  router.use(authRouter);
  router.use(purposesRouter);
} else {
  console.warn("[API] DATABASE_URL is not set; DB-backed routes are disabled.");
}

export default router;
