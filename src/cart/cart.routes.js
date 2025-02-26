import { Router } from "express";
import { getCartByUser, addToCart, updateCartItem, removeFromCart, checkout, getPurchaseHistory } from "./cart.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const router = Router()

router.get(
    '/:userId',
    validateJwt,
    getCartByUser
)

router.post(
    '/add',
    validateJwt,
    addToCart
)

router.put(
    '/update',
    validateJwt,
    updateCartItem
)

router.delete(
    '/remove',
    validateJwt,
    removeFromCart
)

router.post(
    '/checkout',
    validateJwt, 
    checkout
)

router.get(
    '/history/:userId', 
    validateJwt, 
    getPurchaseHistory
)
export default router