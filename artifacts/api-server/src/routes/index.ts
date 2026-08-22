import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import profilesRouter from "./profiles";
import stripeRouter from "./stripe";
import adminRouter from "./admin";
import timezoneRouter from "./timezone";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(profilesRouter);
router.use(stripeRouter);
router.use(adminRouter);
router.use(timezoneRouter);

export default router;
