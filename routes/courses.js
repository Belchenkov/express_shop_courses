const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');
const Course = require('../models/course');

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('price title img');

        res.render('courses', {
            title: 'Курсы',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses
        });
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate('userId', 'email name')
        .select('price title img');

    res.render('course', {
        layout: 'empty',
        title: `Курс`,
        course
    });
});

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }

    try {
        const course = await Course.findById(req.params.id);

        if (!isOwner(course, req)) {
            return res.redirect('/');
        }

        res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/edit', auth, async (req, res) => {
    try {
        const { id } = req.body;
        delete req.body.id;
        const course = await Course.findById(id);

        if (!isOwner(course, req)) {
            return res.redirect('/');
        }

        Object.assign(course, req.body);
        await course.save();

        res.redirect('/courses');
    } catch (err) {
        console.log(err);
    }


});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({ _id: req.body.id });

        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }

});

module.exports = router;