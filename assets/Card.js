const IMG_FOLDER = './imgs/';
const BACK_IMG = 'BACK.png';

module.exports = class Card {
    constructor(n, v, s, loc) {
        this.name = n.toUpperCase();
        this.value = v;
        this.suit = s.toUpperCase();
        this.location = loc;
        this.images = {
            front: this.name + this.suit + '.png',
            back: IMG_FOLDER + BACK_IMG
        };
    }

    getFullName(){
        return this.name + this.suit;
    }

    getName(){
        return this.name;
    }

    getLocation() {
        return this.location;
    }

    getValue() {
        return this.value;
    }

    getSuit() {
        return this.suit;
    }

    toString() {
        return `Name: ${this.name} \tValue: ${this.value} \tSuit: ${this.suit} \tLocation: ${this.location}`;
    }
};
