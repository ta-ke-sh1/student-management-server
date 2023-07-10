module.exports = class Utils {
    async isNonEmptyObject(obj) {
        let values = Object.values(obj);
        return values.includes("");
    }
};
