const DocumentsRepository = require("../repository/documentsRepository");

module.exports = class DocumentsService {
  constructor() {
    this.documentsRepository = new DocumentsRepository();
  }

  async fetchDocuments() {
    return this.documentsRepository.fetchDocuments();
  }

  async fetchDocumentsByUserId(user_id) {
    return this.documentsRepository.fetchDocumentById(user_id);
  }

  async fetchDocumentsByCategory(category) {
    return this.documentsRepository.fetchDocumentsByCategory(category);
  }

  async addDocument(document) {
    document.status = true;
    return this.documentsRepository.addDocument(document);
  }

  async deleteDocument(id) {
    return this.documentsRepository.deleteDocument(id);
  }

  async deleteHardDocument(id) {
    return this.documentsRepository.deleteHardDocument(id);
  }

  async editDocument(id, documents) {
    return this.documentsRepository.editDocument(id, documents);
  }

  async handleDocument(id, option) {
    return this.documentsRepository.editDocument(id, option);
  }
};
