const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');

class Card {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = uuid();
    }
}

module.exports = Card;