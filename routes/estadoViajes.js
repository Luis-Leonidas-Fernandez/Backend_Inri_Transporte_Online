/*
    path: api/status

*/
import { Router } from "express";
import { validarJWTDRIVER } from "../middlewares/validar-jwt-driver.js";
import { statusUpdate, finishTravel } from "../controllers/estadoViajes.js";

const router = Router();

//update the driver's order field
router.put("/update", validarJWTDRIVER, statusUpdate);
//update to finish travel
router.put("/finish-travel", validarJWTDRIVER, finishTravel);

export default router;
