import { response } from "express";
import bcrypt from "bcryptjs";
import { generarJWT } from "../helpers/jwt.js";
import Conductor from "../models/conductor.js";

export const createConductor = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    const existeEmail = await Conductor.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    } else {
      const newConductor = new Conductor(req.body);
      // Encriptar contraseña
      const salt = bcrypt.genSaltSync();
      newConductor.password = bcrypt.hashSync(password, salt);

      // Guarda el nuevo conductor en la base de datos
      const newDriver = await newConductor.save();

      // Almacena el id del nuevo conductor
      const newDriverId = newDriver._id.toString();

      // Generar mi JWT
      const token = await generarJWT(newDriverId);

      const conductor = {
        nombre: newConductor.nombre,
        email: newConductor.email,
        telefono: newConductor.telefono,
        uid: newConductor.id,
        licencia: newConductor.licencia,
        vehiculos: newConductor.vehiculos,
        direccion: newConductor.direccion,
      };

      // Se almacena el token en una cookie llamada "token"
      res.cookie("token", token);

      res.status(200).json({
        conductor,
      });
      console.log(
        "[authConductor.createConductor] Conductor creado:",
        newDriverId
      );
    }
  } catch (error) {
    console.log(
      "[authConductor.createConductor] Error al crear un conductor:",
      error
    );
    res.status(400).json({ error: error });
  }
};
