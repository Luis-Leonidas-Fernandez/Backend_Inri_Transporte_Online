import { response } from "express";
import Usuario from "../models/usuario";

export const getUsuarios = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;

  const usuarios = await Usuario.find({ _id: { $ne: req.uid } })
    .sort("-online")
    .skip(desde)
    .limit(20);

  res.json({
    ok: true,
    usuarios,
  });
};
