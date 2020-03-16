const specialCards = [ 'BACK' ];

class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.special = false;

        specialCards.forEach((spec) => {
            if (this.name == spec) {
                this.special = true;
            }
        });
    }

    getIsSpecial() {
        return this.special;
    }

    getName() {
        return this.name;
    }

    getSuit() {
        if (this.special) {
            return null;
        } else {
            return this.name[1];
        }
    }

    getVal() {
        if (this.special) {
            return null;
        } else {
            return this.name[0];
        }
    }

    getImg() {
        return this.img;
    }

    getX() {
        if (this.pos == null) {
            return 0;
        } else {
            return this.pos['x'];
        }
    }

    getY() {
        if (this.pos == null) {
            return 0;
        } else {
            return this.pos['y'];
        }
    }
}
