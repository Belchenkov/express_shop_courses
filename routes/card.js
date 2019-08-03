const { Router } = require('express');
const router = Router();

const Course = require('../models/course');

router.get('/', async (req, res) => {
    const card = await Course.find({});
    res.json(200, {message: 'Success'});
    /*res.render('card', {
       title: 'Корзина',
       isCard: true,
       courses: card.items,
       price: card.price
    });*/
});

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);

    await req.user.addToCart(course);

    res.redirect('/card');
});

router.delete('/remove/:id', async (req, res) => {
    const card = await Card.remove(req.params.id);

    res.status(200).json(card);
});

module.exports = router;