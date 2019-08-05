const { Router } = require('express');
const router = Router();

const Order = require('../models/order');

router.get('/',  (req, res) => {
    res.render('orders', {
        title: 'Заказы',
        isOrder: true
    });
});

router.post('/',  (req, res) => {
    res.redirect('/orders');
});

module.exports = router;