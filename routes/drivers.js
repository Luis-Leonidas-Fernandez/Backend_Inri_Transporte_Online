/*
    path: api/drivers

*/
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";

import { selectDriver } from "../controllers/drivers.js";
import { obtenerViajeDriver } from "../controllers/viajeDriver.js";
import {
  statusDriverArrived,
  statusDriverDisconnect,
} from "../controllers/estadoViajes.js";
const router = Router();

//ALL DRIVERS AVAILABLE
router.get("/", selectDriver);
//DRIVER RECEIVES AN INCOMING ORDER
router.get("/:_id", validarJWT, obtenerViajeDriver);
router.put("/arrived", validarJWT, statusDriverArrived);
router.put("/disconnect", validarJWT, statusDriverDisconnect);

export default router;
