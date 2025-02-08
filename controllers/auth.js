import { response } from "express";
import bcrypt from "bcryptjs";

import Usuario from "../models/usuario.js";
import { generarJWT } from "../helpers/jwt.js";
import {
  urlMapboxKey,
  tokenMapBoxKey,
  idMapBoxKey,
  mapTokenKey,
} from "../tokens/token.js";

export const crearUsuario = async (req, res = response) => {
  //unica funcion modificada 16/05/2023
  try {
    const { email, password } = req.body;

    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    } else {
      const newUsuario = new Usuario(req.body);
      // Encriptar contraseña
      const salt = bcrypt.genSaltSync();
      newUsuario.password = bcrypt.hashSync(password, salt);

      // Guarda el nuevo usuario en la base de datos
      const newUser = await newUsuario.save();

      // Almacena el id del nuevo usuario
      const newUserId = newUser._id.toString();

      // Generar mi JWT
      const token = await generarJWT(newUserId);

      const usuario = {
        role: newUsuario.role,
        nombre: newUsuario.nombre,
        email: newUsuario.email,
        telefono: newUsuario.telefono,
        online: newUsuario.online,
        uid: newUsuario.id,
        urlMapbox: urlMapboxKey,
        tokenMapBox: tokenMapBoxKey,
        idMapBox: idMapBoxKey,
        mapToken: mapTokenKey,
        cupon: newUsuario.cupon,
      };

      res.cookie("token", token);

      res.status(200).json({
        // ok: true,
        usuario,
        // token,
      });
      console.log(
        "[auth.crearUsuario] Usuario creado:",
        newUserId
      );
    }
  } catch (error) {
    console.log("[auth.crearUsuario] Error al crear un usuario:", error);
    res.status(400).json({ error: error });
  }
};

export const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    // Validar el password
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña no es valida",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuarioDB.id);

    const usuario = {
      role: usuarioDB.role,
      nombre: usuarioDB.nombre,
      email: usuarioDB.email,
      telefono: usuarioDB.telefono,
      online: usuarioDB.online,
      cupon: usuarioDB.cupon,
      uid: usuarioDB.id,
      urlMapbox: urlMapboxKey,
      tokenMapBox: tokenMapBoxKey,
      idMapBox: idMapBoxKey,
      mapToken: mapTokenKey,
    };

    res.cookie("token", token);

    res.status(200).json({
      // ok: true,
      usuario,
      // token,
    });
    console.log("[auth.login] Sesión iniciada:", usuarioDB._id.toString());
  } catch (error) {
    console.log("[auth.login] Error al iniciar sesión:", error);
    res.status(400).json({
      error: error,
    });
  }
};

export const logout = async (_req, res = response) => {
  try {
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).json({ message: "Sesión cerrada correctamente" });
    console.log("[auth.logout] Sesión cerrada.");
  } catch (error) {
    console.log("[auth.logout] Error al cerrar sesión:", error);
    res.status(400).json({ error: error });
  }
};

export const renewToken = async (req, res = response) => {
  const uid = req.uid;

  // generar un nuevo JWT, generarJWT... uid...
  const token = await generarJWT(uid);

  // Obtener el usuario por el UID, Usuario.findById...
  const usuario = await findById(uid);

  res.json({
    ok: true,
    usuario,
    token,
    urlMapbox: urlMapboxKey,
    tokenMapBox: tokenMapBoxKey,
    idMapBox: idMapBoxKey,
    mapToken: mapTokenKey,
  });
};
