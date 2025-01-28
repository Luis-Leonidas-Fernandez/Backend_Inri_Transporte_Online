/*
    path: api/usuarios

*/
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";

import { getUsuarios } from "../controllers/usuarios.js";

const router = Router();

router.get("/", validarJWT, getUsuarios);

export default router;
