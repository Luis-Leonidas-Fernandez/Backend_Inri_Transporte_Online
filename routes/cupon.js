/*
    Path: /api/cupon
*/
import { Router } from "express";
import { addVaucher, addPrice, deletedVauchers } from "../controllers/cupones.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

//ADD VAUCHER TO USERS
router.patch("/:_id", addVaucher);
router.patch("/price/:_id", addPrice);
router.patch("/vauchers/:_id", validarJWT, deletedVauchers);

export default router;
