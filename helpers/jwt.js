import jwt from "jsonwebtoken";

export const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      // Se añadio una clave generica por si no esta configurado el .env
      process.env.JWT_KEY || 'asdw1234',
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          // no se pudo crear el token
          reject("No se pudo generar el JWT");
        } else {
          // TOKEN!
          resolve(token);
        }
      }
    );
  });
};

export const comprobarJWT = (token = "") => {
  try {
    const { uid } = jwt.verify(token, process.env.JWT_KEY);
    return [true, uid];
  } catch (error) {
    return [false, null];
  }
};
