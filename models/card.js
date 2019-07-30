const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
);

class Card {
    static async add(course) {
        const card = await Card.fetch();

        const idx = card.courses.findIndex(c => c.id === course.id)
        const candidate = card.courses[idx];

        if (candidate) {
            // course exists in card
            candidate.count++;
            card.courses[idx] = candidate;
        } else {
            // need add course to card
            course.count = 1;
            card.courses.push(course);
        }

        card.price += +course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err);
                } else {
                    resolve('Курс добавлен в корзину');
                }
            });
        });
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
           fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(content));
                }
           });
        });
    }

    static async remove(id) {
        const card = await Card.fetch();
        const idx = card.courses.findIndex(c => c.id === id);
        const course = card.courses[idx];

        if (course.count === 1) {
            // delete course
            card.courses = card.courses.filter(c => c.id !== id);
        } else {
            // change count
            card.courses[idx].count--;
        }

        // recount total price
        card.price -= course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(card);
                }
            });
        });

    }
}

module.exports = Card;