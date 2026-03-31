import { Router, type IRouter } from "express";
import healthRouter from "./health";
import purposesRouter from "./purposes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(purposesRouter);

export default router;
