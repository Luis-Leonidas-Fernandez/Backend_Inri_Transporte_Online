import { Router } from "express";
import { getBidsForConductor, postBid } from "../controllers/bids.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// path: /api/bids
router.post("/bids", validarJWT, postBid);
router.get("/bids", validarJWT, getBidsForConductor);

export default router;
