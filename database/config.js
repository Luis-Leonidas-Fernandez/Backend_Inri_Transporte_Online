import mongoose from "mongoose";

/**
 * Establece la conexión con la base de datos.
 * Utiliza la URL definida en la variable de entorno `DB_URL` o, en su defecto, conecta a MongoDB en localhost (puerto 27017).
 */
export const dbConnection = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017");
    console.log("Base de datos conectada correctamente.");
  } catch (error) {
    console.log("Error al conectar la base de datos: ", error);
  }
};
