/*
    path: api/invoice

*/

import { Router } from "express";
import {
  createInvoicePdf,
  createInvoice,
  getInvoice,
  getInvoicePdf,
} from "../controllers/invoice.js";

const router = Router();

router.post("/new", createInvoice);
router.get("/get-invoice/:_id", getInvoice);

router.get("/create-pdf-invoice", createInvoicePdf);
router.get("/get-pdf-invoice/:_id", getInvoicePdf);

export default router;
