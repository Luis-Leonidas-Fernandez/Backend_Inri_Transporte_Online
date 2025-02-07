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
    console.log("[postOrder] Orden guardada:", orderSaved._id.toString());
  } catch (error) {
    console.error("Error al guardar la orden:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.uid;

    // Busca en la colección orders las ordenes del usuario y las ordena de la más reciente a la más antigua.
    const orders = await Orders.find({ idUser: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ orders });
    console.log("[getOrders] Ordenes encontradas:", orders.length);
  } catch (error) {
    console.log("[getOrders] Se ha producido un error:", error);
    res.status(400).json({ error: error });
  }
};
