import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  getOrders,
  getOrdersForUser,
  postOrder,
} from "../controllers/orders.js";

const router = Router();

// path: /api/orders
router.post("/orders", validarJWT, postOrder);
router.get("/orders", validarJWT, getOrdersForUser);

// path: /api/orders/all
router.get("/orders/all", validarJWT, getOrders);

export default router;
