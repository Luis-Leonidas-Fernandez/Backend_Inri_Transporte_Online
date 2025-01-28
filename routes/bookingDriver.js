/*
    path: api/travel

*/
import { Router } from "express";
import { assigClient, removeClient } from "../controllers/assigTravel.js";

const router = Router();

router.patch("/:_id", assigClient);
router.put("/:_id", removeClient);

export default router;
