import Orders from "../models/orders.js";

export const postOrder = async (req, res) => {
  try {
    const { carga, prioridad, estadoSubasta, origen, destino } = req.body;

    // UserId desde JWT
    const userId = req.uid;

    const newOrder = new Orders({
      idUser: userId,
      carga: carga,
      origen: origen,
      destino: destino,
      prioridad: prioridad,
      estadoSubasta: estadoSubasta,
    });

    // Se guarda la nueva orden en la DB
    const orderSaved = await newOrder.save();

    res.status(201).json({ orderSaved });
  } catch (error) {
    console.error("Error al guardar la orden:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
