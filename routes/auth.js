import { Router } from "express";
import { check } from "express-validator";
import {
  crearUsuario,
  login,
  logout,
  renewToken,
} from "../controllers/auth.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// path: /api/register
router.post(
  "/register",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El correo es obligatorio").isEmail(),
    check("telefono", "El telefono es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearUsuario
);

// path: /api/login
router.post(
  "/login",
  [
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El correo es obligatorio").isEmail(),
  ],
  login
);

// path: /api/logout
router.post("/logout", logout);

router.get("/renew", validarJWT, renewToken);

export default router;
