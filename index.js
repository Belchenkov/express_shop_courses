const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');

const app = express();

// Routes
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');

// Handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

// Register `hbs.engine` with the Express app.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

// Middleware Routes
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        const mongoURL = 'mongodb://belchenkov:12qwasZX@ds013559.mlab.com:13559/express_shop_courses';

        await mongoose.connect(mongoURL, {useNewUrlParser: true});

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();


