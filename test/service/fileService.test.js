const fs = require("fs");
const path = require("path"); // replace with your module
const FileService = require("../../services/fileService");

jest.mock("fs");
jest.mock("path");

const fileService = new FileService();

describe("addMultipleFilesByPath", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create directory and move files if directory does not exist", () => {
    const files = [
      { path: "path1", originalname: "name1" },
      { path: "path2", originalname: "name2" },
    ];
    const file_path = "dir";

    fs.existsSync.mockReturnValue(false);
    fs.mkdirSync.mockImplementation(() => {});
    fs.renameSync.mockImplementation(() => {});

    fileService.addMultipleFilesByPath(files, file_path);

    expect(fs.existsSync).toHaveBeenCalledWith(file_path);
    expect(fs.mkdirSync).toHaveBeenCalledWith(file_path, { recursive: true }, expect.any(Function));
    files.forEach((file) => {
      expect(fs.renameSync).toHaveBeenCalledWith(file.path, path.join(file_path, file.originalname), expect.any(Function));
    });
  });

  it("should move files if directory exists", () => {
    const files = [
      { path: "path1", originalname: "name1" },
      { path: "path2", originalname: "name2" },
    ];
    const file_path = "dir";

    fs.existsSync.mockReturnValue(true);
    fs.renameSync.mockImplementation(() => {});

    fileService.addMultipleFilesByPath(files, file_path);

    expect(fs.existsSync).toHaveBeenCalledWith(file_path);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    files.forEach((file) => {
      expect(fs.renameSync).toHaveBeenCalledWith(file.path, path.join(file_path, file.originalname), expect.any(Function));
    });
  });

  it("should catch error if directory creation fails", () => {
    const files = [
      { path: "path1", originalname: "name1" },
      { path: "path2", originalname: "name2" },
    ];
    const file_path = "dir";

    fs.existsSync.mockReturnValue(false);
    fs.mkdirSync.mockImplementation(() => {
      throw new Error("Error creating directory");
    });

    const result = fileService.addMultipleFilesByPath(files, file_path);

    expect(fs.existsSync).toHaveBeenCalledWith(file_path);
    expect(fs.mkdirSync).toHaveBeenCalledWith(file_path, { recursive: true }, expect.any(Function));
    expect(result).toBe(false);
  });

  it("should catch error if file moving fails", () => {
    const files = [
      { path: "path1", originalname: "name1" },
      { path: "path2", originalname: "name2" },
    ];
    const file_path = "dir";

    fs.existsSync.mockReturnValue(true);
    fs.renameSync.mockImplementation(() => {
      throw new Error("Error moving file");
    });

    const result = fileService.addMultipleFilesByPath(files, file_path);

    expect(fs.existsSync).toHaveBeenCalledWith(file_path);
    expect(fs.renameSync).toHaveBeenCalledWith(files[0].path, path.join(file_path, files[0].originalname), expect.any(Function));
    expect(result).toBe(false);
  });
});

jest.mock("fs");
jest.mock("path");
