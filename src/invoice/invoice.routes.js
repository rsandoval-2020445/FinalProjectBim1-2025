import { Router } from "express";
import { 
    createInvoice, 
    getInvoiceById, 
    updateInvoice, 
    deleteInvoice 
} from "./invoice.controller.js";

import { validateJwt } from "../../middlewares/validate.jwt.js";

const router = Router()

router.get(
    '/:id',
    validateJwt, 
    getInvoiceById
)

router.post(
    '/',
    validateJwt, 
    createInvoice
)

router.put(
    '/:id',
    validateJwt, 
    updateInvoice
)

router.delete(
    '/:id',
    validateJwt, 
    deleteInvoice
)

export default router