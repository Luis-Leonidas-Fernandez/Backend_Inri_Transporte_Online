/*
    path: api/booking

*/
import { Router } from "express";
import { removeDriver, assigDriverAutomatic } from "../controllers/assigDriver.js";

const router = Router();

router.patch("/:_id", assigDriverAutomatic);
router.put("/remove", removeDriver);

export default router;
