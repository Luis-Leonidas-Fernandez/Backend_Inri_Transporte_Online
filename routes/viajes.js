/*
    Path: /api/viajes
*/
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";

import { obtenerViajeUsuario } from "../controllers/viajes.js";
const router = Router();

//USER CHECK THE STATUS OF THEIR ORDER
router.get("/:_id", validarJWT, obtenerViajeUsuario);

export default router;
