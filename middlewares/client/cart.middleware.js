const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    let cart;
    if(!req.cookies.cartId){
        const cart = new Cart();
        await cart.save();

        const expireCookie = 30 * 24 * 60 * 60 * 1000;
        res.cookie("cartId", cart.id, {
            expires : new Date(Date.now() + expireCookie)
        });
    }else{
        cart = await Cart.findOne({_id: req.cookies.cartId});
        if(cart.books.length > 0)
            cart.totalQuantityBook = cart.books.reduce((sum, item) => sum + item.quantity, 0);
    }
    res.locals.miniCart = cart;
    next();
}