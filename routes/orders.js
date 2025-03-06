import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  getOpenOrders,
  getOrders,
  getOrdersForUser,
  getOrdersForUserComplete,
  postOrder,
  updateOrderState,
} from "../controllers/orders.js";

const router = Router();

// path: /api/orders
router.post("/orders", validarJWT, postOrder);
router.get("/orders", validarJWT, getOrdersForUser);
router.get("/orders/bids", validarJWT, getOrdersForUserComplete);
router.get("/orders/open", validarJWT, getOpenOrders);

// path: /api/orders/all
router.get("/orders/all", validarJWT, getOrders);

// path: /api/orders/:id
router.patch("/orders/:_id", validarJWT, updateOrderState);

export default router;
