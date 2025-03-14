import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {
  getOpenOrders,
  getOrders,
  getOrdersForUser,
  getOrdersForUserComplete,
  postOrder,
  removeUnselectedBids,
  updateOrderState,
} from "../controllers/orders.js";
import { validarOrder } from "../middlewares/validar-order.js";

const router = Router();

// path: /api/orders
router.post("/orders", validarJWT, validarOrder, postOrder);
router.get("/orders", validarJWT, getOrdersForUser);
router.get("/orders/bids", validarJWT, getOrdersForUserComplete);
router.get("/orders/open", validarJWT, getOpenOrders);

// path: /api/orders/all
router.get("/orders/all", validarJWT, getOrders);

// path: /api/orders/:id
router.patch("/orders/:_id", validarJWT, updateOrderState);

// path: /api/orders/:id/bids
router.delete("/orders/:_id/bids", validarJWT, removeUnselectedBids);

export default router;
