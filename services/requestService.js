const RequestRepostory = require("../repository/requestRepository");

module.exports = class RequestService {
    constructor() {
        this.requestRepository = new RequestRepostory();
    }

    async fetchRequests() {
        return this.requestRepository.fetchRequest();
    }

    async fetchRequestsByDate(date) {}

    async authRequest() {}

    async declineRequest() {}
};
