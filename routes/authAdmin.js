/*
    path: api/loginadmin

*/
import { Router } from "express";
import { check } from "express-validator";

import {
  crearAdmin,
  loginAdmin,
  renewTokenAdmin,
} from "../controllers/authAdmin.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
  "/new",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El correo es obligatorio").isEmail(),
    validarCampos,
  ],
  crearAdmin
);

router.post(
  "/",
  [
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El correo es obligatorio").isEmail(),
  ],
  loginAdmin
);

router.get("/renew", validarJWT, renewTokenAdmin);

export default router;
