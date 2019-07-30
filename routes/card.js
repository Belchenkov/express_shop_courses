const { Router } = require('express');
const router = Router();

const Course = require('../models/course');
const Card = require('../models/card');

router.get('/', async (req, res) => {
    const card = await Card.fetch();

    res.render('card', {
       title: 'Корзина',
       card
    });
});

router.post('/add', async (req, res) => {
    const course = await Course.getById(req.body.id);

    await Card.add(course);

    res.redirect('/card');
});

module.exports = router;