import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { postOrder } from "../controllers/orders.js";

const router = Router();

// path: /api/orders
router.post("/orders", validarJWT, postOrder);

export default router;
