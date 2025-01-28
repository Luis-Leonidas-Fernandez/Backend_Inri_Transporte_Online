/*
    path: api/base

*/
import { Router } from "express";
import { check } from "express-validator";

import {
  addBaseAdmin,
  addBaseDriver,
  getDriversfromBase,
} from "../controllers/addBase.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

//create base from admin
router.post(
  "/new/:_id",
  [
    check("zona", "La zona es obligatoria").not().isEmpty(),
    check("base", "La base es obligatoria").not().isEmpty(),
    check("ubicacion", "La ubicacion es obligatoria").not().isEmpty(),
    validarCampos,
    validarJWT,
  ],
  addBaseAdmin
);

//add driver to base
router.put(
  "/add-driver-to-base/:_id",
  [
    check("zona", "La zona es obligatoria").not().isEmpty(),
    check("base", "La base es obligatoria").not().isEmpty(),
    validarCampos,
    validarJWT,
  ],
  addBaseDriver
);

//get base and drivers
router.get("/drivers-from-admin/:_id/:base", validarJWT, getDriversfromBase);

export default router;
