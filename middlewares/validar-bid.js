import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";

export const validarBid = [
  body("idOrder", "El idOrder es obligatorio y debe ser un ObjectId válido")
    .notEmpty()
    .isMongoId(),
  body("oferta.valor", "El valor debe ser un numero y es un campo obligatorio")
    .notEmpty()
    .isNumeric(),
  body(
    "oferta.moneda",
    "La moneda debe ser un string y es un campo obligatorio"
  )
    .notEmpty()
    .isString(),
  body("comentario", "El comentario debe ser un string").optional().isString(),
  body(
    "distanciaAlOrigen",
    "la distanciaAlOrigen debe ser un numero y es un campo obligatorio"
  )
    .notEmpty()
    .isNumeric(),
  validarCampos,
];
