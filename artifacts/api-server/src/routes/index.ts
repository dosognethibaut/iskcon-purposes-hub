import { Router, type IRouter } from "express";
import healthRouter from "./health";
import purposesRouter from "./purposes";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(purposesRouter);

export default router;
