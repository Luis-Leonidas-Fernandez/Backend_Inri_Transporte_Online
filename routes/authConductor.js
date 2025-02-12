import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import {
  createConductor,
  loginConductor,
  logoutConductor,
} from "../controllers/authConductor.js";

const router = Router();

// path: /api/driver/register
router.post(
  "/register",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El correo es obligatorio").isEmail(),
    check("telefono", "El telefono es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createConductor
);

// path: /api/driver/login
router.post(
  "/login",
  [
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El correo es obligatorio").isEmail(),
  ],
  loginConductor
);

// path: /api/driver/logout
router.post("/logout", logoutConductor);

export default router;
