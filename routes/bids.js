import { Router } from "express";
import {
  deleteBid,
  getBidsForConductor,
  postBid,
} from "../controllers/bids.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarBid } from "../middlewares/validar-bid.js";

const router = Router();

// path: /api/bids
router.post("/bids", validarJWT, validarBid, postBid);
router.get("/bids", validarJWT, getBidsForConductor);

// path: /api/bids/_id
router.delete("/bids/:_id", validarJWT, deleteBid);

export default router;
