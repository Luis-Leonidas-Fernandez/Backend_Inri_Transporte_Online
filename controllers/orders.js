import mongoose from "mongoose";
import Orders from "../models/orders.js";
import Bids from "../models/bids.js";

export const postOrder = async (req, res) => {
  try {
    const { carga, prioridad, estadoSubasta, origen, destino, fechaRetiro } =
      req.body;

    // UserId desde JWT
    const userId = req.uid;

    const newOrder = new Orders({
      idUser: userId,
      carga: carga,
      origen: origen,
      destino: destino,
      prioridad: prioridad,
      estadoSubasta: estadoSubasta,
      fechaRetiro: fechaRetiro,
    });

    // Se guarda la nueva orden en la DB
    const orderSaved = await newOrder.save();

    res.status(201).json({ orderSaved });
    console.log(
      "[orders.postOrder] Orden guardada:",
      orderSaved._id.toString()
    );
  } catch (error) {
    console.error("[orders.postOrder] Error al guardar la orden:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// General para todos los usuarios, filtrar por estadoSubasta 'abierto'
export const getOrders = async (req, res) => {
  try {
    // Busca la colección orders y las ordena de la más reciente a la más antigua.
    const orders = await Orders.find({})
      .populate("idUser", "nombre email telefono")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
    console.log("[orders.getOrders] Ordenes encontradas:", orders.length);
  } catch (error) {
    console.log("[orders.getOrders] Se ha producido un error:", error);
    res.status(400).json({ error: error });
  }
};

export const getOpenOrders = async (req, res) => {
  try {
    // Busca la colección orders, trae las ordenes con subasta abierta y las ordena de la más reciente a la más antigua.
    const orders = await Orders.find({ estadoSubasta: "abierto" })
      .populate("idUser", "nombre email telefono")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
    console.log(
      "[orders.getOpenOrders] Ordenes abiertas encontradas:",
      orders.length
    );
  } catch (error) {
    console.log("[orders.getOpenOrders] Se ha producido un error:", error);
    res.status(400).json({ error: error });
  }
};

// getOrdersForUser para un user en particular
export const getOrdersForUser = async (req, res) => {
  try {
    const userId = req.uid;

    // Busca en la colección orders las ordenes del usuario y las ordena de la más reciente a la más antigua.
    const orders = await Orders.find({ idUser: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ orders });
    console.log(
      "[orders.getOrdersForUser] Ordenes encontradas:",
      orders.length
    );
  } catch (error) {
    console.log("[orders.getOrdersForUser] Se ha producido un error:", error);
    res.status(400).json({ error: error });
  }
};

// Trae todas las ordenes de un usuario con sus respectivas propuestas(bids)
export const getOrdersForUserComplete = async (req, res) => {
  try {
    const userId = req.uid;
    // Trae la coleccion bids con el campo del conductor poblado
    const bidsPopulate = await Bids.find({}).populate(
      "idConductor",
      "nombre email telefono vehiculos licencia direccion"
    );
    const ordersForUser = await Orders.find({ idUser: userId }).sort({
      createdAt: -1,
    });

    // Construye el objeto con la orden y sus bids
    const orders = ordersForUser.map((order) => {
      const bids = bidsPopulate.filter((bid) => order._id.equals(bid.idOrder));
      return { ...order.toObject(), bids };
    });

    res.status(200).json({ orders });
    console.log(
      "[orders.getOrdersForUserComplete] Ordenes encontradas:",
      orders.length
    );
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("[orders.getOrdersForUserComplete] Error:", error);
  }
};

export const updateOrderState = async (req, res) => {
  try {
    const { _id } = req.params;
    const { estadoSubasta } = req.body;

    const idOrder = new mongoose.Types.ObjectId(_id);

    const orderUpdated = await Orders.findByIdAndUpdate(
      { _id: idOrder },
      { estadoSubasta: estadoSubasta }, // Actualiza el campo estadoSubasta
      { new: true } // Muestra el documento actualizado
    );
    res.status(200).json(orderUpdated);
    console.log(
      "[orders.updateOrderState] Se actualizó el estado de la orden:",
      _id
    );
  } catch (error) {
    console.log("[orders.updateOrderState] Se ha producido un error:", error);
    res.status(400).json({ error: error });
  }
};

export const removeUnselectedBids = async (req, res) => {
  try {
    const { _id } = req.params;
    const { bidSelectedId } = req.body;

    // Si no se ingresa el campo bidSelectedId o es un string vacio da error
    if (!bidSelectedId)
      return res.status(400).json({ error: "Ingrese un bidSelectedId" });

    // Verifica si la bid existe en la DB y si coincide con la order
    const bidSelectedDB = await Bids.find({ _id: bidSelectedId, idOrder: _id });
    if (bidSelectedDB.length <= 0)
      return res.status(400).json({
        error: "No se encontro la bid seleccionada en la base de datos",
      });

    const selectedBid = await Bids.deleteMany({
      // Busca las bids de la order
      idOrder: _id,
      // Excluye la bid que fue seleccionada
      _id: { $ne: bidSelectedId },
    });

    res.status(200).json(selectedBid);
    console.log(
      "[orders.removeUnselectedBids] Se eliminaron las propuestas no seleccionadas"
    );
  } catch (error) {
    res.status(400).json({ error: error });
    console.log(
      "[orders.removeUnselectedBids] Se ha producido un error:",
      error
    );
  }
};
