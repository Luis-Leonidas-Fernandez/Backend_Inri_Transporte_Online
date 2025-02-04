import Order from "../models/orders.js";

export const postOrder = async (req, res) => {
  try {
    const { tipoCarga, peso, tamaño, ubicacion, prioridad, estadoSubasta } =
      req.body;

    // UserId desde JWT
    const userId = req.uid;

    const newOrder = new Order({
      idUser: userId,
      tipoCarga: tipoCarga,
      peso: peso,
      tamaño: tamaño,
      ubicacion: ubicacion,
      prioridad: prioridad,
      estadoSubasta: estadoSubasta,
    });

    // Se guarda la nueva orden en la DB
    const orderSaved = await newOrder.save();

    res
      .status(201)
      .json({ message: "Orden guardada correctamente", orderSaved });
  } catch (error) {
    console.error("Error al guardar la orden:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
