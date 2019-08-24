const express = require('express');
const path = require('path');
const csurf = require('csurf');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');

// Config
const keys = require('./keys');

const app = express();

// Middleware
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const varMiddleware = require('./middleware/variables');

// Routes
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
});

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
});

// Register `hbs.engine` with the Express app.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csurf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

// Middleware Routes
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();


