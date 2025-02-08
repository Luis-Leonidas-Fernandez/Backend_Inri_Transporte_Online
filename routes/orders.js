import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { getOrders, postOrder } from "../controllers/orders.js";

const router = Router();

// path: /api/orders
router.post("/orders", validarJWT, postOrder);
router.get("/orders", validarJWT, getOrders);

export default router;
