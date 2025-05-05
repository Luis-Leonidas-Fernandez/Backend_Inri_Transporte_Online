import { Router } from "express";
import {
  connectMercado,
  createPreferenceMP,
  getAccessToken,
  webHooks,
  refundTotal,
  refundPartial,
} from "../controllers/payments.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// path: /api/payments
router.post("/payments", validarJWT, createPreferenceMP);
router.get("/payments/connect", validarJWT, connectMercado);
router.get("/payments/accessToken", getAccessToken);
router.post("/payments/webhooks", webHooks);
router.post("/payments/refund/total", refundTotal);
router.post("/payments/refund/partial", refundPartial);

export default router;
