import { Router } from "express";
import {
  connectMercado,
  createPreference,
  getAccessToken,
} from "../controllers/payments.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// path: /api/payments
router.post("/payments", validarJWT, createPreference);
router.get("/payments/connect", validarJWT, connectMercado);
router.get("/payments/accessToken", validarJWT, getAccessToken);

export default router;
 