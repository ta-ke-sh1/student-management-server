module.exports = class Utils {
    async isNonEmptyObject(obj) {
        let values = Object.values(obj);
        return values.includes("");
    }

    randomIntWithinRange(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
};
