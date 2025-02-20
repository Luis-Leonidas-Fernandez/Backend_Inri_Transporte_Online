import Bids from "../models/bids.js";

export const postBid = async (req, res) => {
  try {
    const { idOrder, oferta, comentario } = req.body;
    const conductorId = req.uid;

    const newBid = new Bids({
      idConductor: conductorId,
      idOrder: idOrder,
      oferta: oferta,
      comentario: comentario || "", // Si no hay comentario se guarda un string vacio para no guardar un null
    });

    const bidSaved = await newBid.save();

    res.status(201).json({ bidSaved });
    console.log("[bids.postBid] Oferta guardada:", bidSaved._id.toString());
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("[bids.postBid] Se ha producido un error:", error);
  }
};
