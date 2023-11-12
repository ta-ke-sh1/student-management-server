const RequestRepostory = require("../repository/requestRepository");
const path = require("path");
const FileService = require("./fileService");

module.exports = class RequestService {
  fileService;
  requestRepository;

  constructor() {
    this.fileService = new FileService();
    this.requestRepository = new RequestRepostory();
  }

  async fetchRequests() {
    return this.requestRepository.fetchRequest();
  }

  async fetchUserRequests(id) {
    return this.requestRepository.fetchUserRequests(id);
  }

  async addRequest(request, file) {
    const folder = path.join(path.resolve(), "asset", "requests");
    this.fileService.addFileByPath(file, folder);
    delete request.file;
    request.path = folder;
    request.date = new Date().getTime();
    request.remark = "In progress";
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
