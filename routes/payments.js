import { Router } from "express";
import { createPreference } from "../controllers/payments.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// path: /api/payments
router.post("/payments", validarJWT, createPreference);

export default router;
