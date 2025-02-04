/*
    path: api/ubicaciones

*/

import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
// import { validarDistanciaEntreCoordendas} from '../middlewares/validar-distancia';
import {
  postUbicacion,
  getUbicaciones,
  removeAddress,
} from "../controllers/authCoordenadas.js";
const router = Router();

//USER ENTERS AN ORDER
router.post("/lugar", validarJWT, postUbicacion);
router.put("/remove/address", validarJWT, removeAddress);

//GET ALL THE ORDERS
router.get("/", getUbicaciones);

export default router;
