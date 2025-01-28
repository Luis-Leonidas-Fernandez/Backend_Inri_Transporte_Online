/*
    path: api/location

*/
import { Router } from "express";
import { validarJWTDRIVER } from "../middlewares/validar-jwt-driver.js";
import { locationDriverUpdate } from "../controllers/estadoViajes.js";

const router = Router();

//update driver position real time
router.put("/driver-position", validarJWTDRIVER, locationDriverUpdate);

export default router;
