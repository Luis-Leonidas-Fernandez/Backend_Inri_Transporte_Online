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
      selected: false,
    });

    const bidSaved = await newBid.save();

    res.status(201).json({ bidSaved });
    console.log("[bids.postBid] Oferta guardada:", bidSaved._id.toString());
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("[bids.postBid] Se ha producido un error:", error);
  }
};

export const getBidsForConductor = async (req, res) => {
  try {
    const conductorId = req.uid;
    const bids = await Bids.find({ idConductor: conductorId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ bids });
    console.log("[bids.getBidsForConductor] Ofertas encontradas:", bids.length);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("[bids.getBidsForConductor] Se ha producido un error", error);
  }
};

export const deleteBid = async (req, res) => {
  try {
    const { _id } = req.params;
    const bidDeleted = await Bids.findByIdAndDelete({ _id: _id });
    if (!bidDeleted) {
      console.log("[bids.deleteBid] La bid no fue encontrada");
      return res.status(404).json({ error: "La bid no fue encontrada" });
    }

    console.log("[bids.deleteBid] La bid fue eliminada correctamente");
    res.sendStatus(204).json({});
  } catch (error) {
    console.log("[bids.deleteBid] Se ha producido un error:", error);
    res.status(400).json({ error: error });
  }
};
