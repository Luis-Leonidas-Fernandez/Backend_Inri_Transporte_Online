import { Router } from "express";
import { postBid } from "../controllers/bids.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

// path: /api/bids
router.post("/bids", validarJWT, postBid);

export default router;
