import { check, body } from "express-validator";
import { validarCampos } from "./validar-campos.js";

export const validarOrder = [
  body("carga")
    .isArray({ min: 1 })
    .withMessage("Debe haber al menos un elemento en carga"),

  body("carga.*.tipoCarga", "El tipoCarga debe ser un string")
    .optional()
    .isString(),
  body("carga.*.pesoTotal.peso", "El peso debe ser un número")
    .optional()
    .isNumeric(),
  body("carga.*.pesoTotal.unidadPeso", "La unidadPeso debe ser un string")
    .optional()
    .isString(),

  body("carga.*.medidasTotal.alto", "El alto debe ser un número")
    .optional()
    .isNumeric(),
  body("carga.*.medidasTotal.ancho", "El ancho debe ser un número")
    .optional()
    .isNumeric(),
  body("carga.*.medidasTotal.profundidad", "La profundidad debe ser un número")
    .optional()
    .isNumeric(),
  body(
    "carga.*.medidasTotal.unidadMedida",
    "La unidadMedida debe ser un string"
  )
    .optional()
    .isString(),

  check("origen.calle", "La calle del origen es un string obligatorio")
    .notEmpty()
    .isString(),
  check("origen.altura", "La altura del origen es un string obligatorio")
    .notEmpty()
    .isString(),
  check("origen.provincia", "La provincia del origen es un string obligatorio")
    .notEmpty()
    .isString(),
  check("origen.ciudad", "La ciudad del origen es un string obligatorio")
    .notEmpty()
    .isString(),
  check("origen.codigoPostal", "El codigoPostal del origen es obligatorio")
    .notEmpty()
    .isString(),
  check("origen.referencia", "La referencia del origen debe ser un string")
    .optional()
    .isString(),

  check("destino.calle", "La calle del destino es un string obligatorio")
    .notEmpty()
    .isString(),
  check("destino.altura", "La altura del destino es un string obligatorio")
    .notEmpty()
    .isString(),
  check(
    "destino.provincia",
    "La provincia del destino es un string obligatorio"
  )
    .notEmpty()
    .isString(),
  check("destino.ciudad", "La ciudad del destino es un string obligatorio")
    .notEmpty()
    .isString(),
  check("destino.codigoPostal", "El codigoPostal del destino es obligatorio")
    .notEmpty()
    .isString(),
  check("destino.referencia", "La referencia del destino debe ser un string")
    .optional()
    .isString(),

  check("prioridad", "La prioridad debe ser un string").optional().isString(),
  check("estadoSubasta", "El estadoSubasta debe ser un string")
    .optional()
    .isString(),
  check("fechaRetiro", "La fechaRetiro debe ser una fecha válida")
    .optional()
    .isISO8601(),

  validarCampos,
];
