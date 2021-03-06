const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');
const Course = require('../models/course');

function mapCart(cart) {
    return cart.items.map(c => ({
      ...c.courseId._doc,
        count: c.count,
        id: c.courseId.id
    }));
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0);
}

router.get('/', auth, async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();

    const courses = mapCart(user.cart);

    res.render('card', {
       title: 'Корзина',
       isCard: true,
       courses,
       price: computePrice(courses)
    });
});

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);

    await req.user.addToCart(course);

    res.redirect('/card');
});

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id);

    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();
    const courses = mapCart(user.cart);
    const cart = {
        courses,
        price: computePrice(courses)
    };

    res.status(200).json(cart);
});

module.exports = router;