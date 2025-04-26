import { Router } from "express";
import {
  connectMercado,
  createPreferenceMP,
  getAccessToken,
  webHooks,
} from "../controllers/payments.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// path: /api/payments
router.post("/payments", validarJWT, createPreferenceMP);
router.get("/payments/connect", validarJWT, connectMercado);
router.get("/payments/accessToken", getAccessToken);
router.post("/payments/webhooks", webHooks);

export default router;
