const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');

// Models
const User = require('./models/user');

const app = express();

// Routes
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

// Middleware
const varMiddleware = require('./middleware/variables');

// Handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

// Register `hbs.engine` with the Express app.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5d43b4f304c64e06a8ff6fc1');
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false
}));
app.use(varMiddleware);

// Middleware Routes
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        const mongoURL = 'mongodb://belchenkov:12qwasZX@ds013559.mlab.com:13559/express_shop_courses';

        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useFindAndModify: false
        });

        const candidate = await User.findOne();

        if (!candidate) {
            const user = new User({
                email: 'u608110@gmail.com',
                name: 'Belchenkov',
                cart: {items: []}
            });

            await user.save();
        }

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();


