import jwt from "jsonwebtoken";

export const validarJWT = (req, res, next) => {
  // Leer token
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_KEY || "asdw1234");
    req.uid = uid;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }
};
