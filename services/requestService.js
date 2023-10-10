const RequestRepostory = require("../repository/requestRepository");

module.exports = class RequestService {
  constructor() {
    this.requestRepository = new RequestRepostory();
  }

  async fetchRequests() {
    return this.requestRepository.fetchRequest();
  }

  async fetchRequestsByUser(user_id) {}

  async fetchRequestsByCategory(category) {}

  async addRequest(request) {
    return this.requestRepository.addRequest(request);
  }

  async deleteRequest(id) {
    return this.requestRepository.deleteRequest(id);
  }

  async deleteHardRequest(id) {
    return this.requestRepository.deleteHardRequest(id);
  }

  async editRequest(id, request) {
    return this.requestRepository.editRequest(id, request);
  }

  async handleRequest(id, option) {
    return this.requestRepository.editRequest(id, option);
  }
};
