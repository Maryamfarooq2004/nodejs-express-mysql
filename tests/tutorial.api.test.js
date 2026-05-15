const request = require("supertest");

const mockTutorialModel = jest.fn(function Tutorial(tutorial) {
  Object.assign(this, tutorial);
});

mockTutorialModel.create = jest.fn();
mockTutorialModel.getAll = jest.fn();
mockTutorialModel.findById = jest.fn();
mockTutorialModel.getAllPublished = jest.fn();
mockTutorialModel.updateById = jest.fn();
mockTutorialModel.remove = jest.fn();
mockTutorialModel.removeAll = jest.fn();

jest.mock("../app/models/tutorial.model.js", () => mockTutorialModel);

const app = require("../server");

describe("tutorial api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("gets the welcome message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Welcome to bezkoder application." });
  });

  test("gets all tutorials", async () => {
    mockTutorialModel.getAll.mockImplementation((title, callback) => {
      callback(null, [{ id: 1, title: "Node.js basics" }]);
    });

    const response = await request(app).get("/api/tutorials");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, title: "Node.js basics" }]);
    expect(mockTutorialModel.getAll).toHaveBeenCalledWith(undefined, expect.any(Function));
  });

  test("filters tutorials by title query", async () => {
    mockTutorialModel.getAll.mockImplementation((title, callback) => {
      callback(null, [{ id: 2, title }]);
    });

    const response = await request(app).get("/api/tutorials?title=Express");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 2, title: "Express" }]);
    expect(mockTutorialModel.getAll).toHaveBeenCalledWith("Express", expect.any(Function));
  });

  test("gets published tutorials", async () => {
    mockTutorialModel.getAllPublished.mockImplementation(callback => {
      callback(null, [{ id: 3, published: true }]);
    });

    const response = await request(app).get("/api/tutorials/published");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 3, published: true }]);
  });

  test("gets one tutorial by id", async () => {
    mockTutorialModel.findById.mockImplementation((id, callback) => {
      callback(null, { id: Number(id), title: "Mongo not used" });
    });

    const response = await request(app).get("/api/tutorials/7");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 7, title: "Mongo not used" });
  });

  test("creates a tutorial", async () => {
    mockTutorialModel.create.mockImplementation((tutorial, callback) => {
      callback(null, { id: 10, ...tutorial });
    });

    const response = await request(app)
      .post("/api/tutorials")
      .send({ title: "Jest", description: "API testing", published: false });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 10,
      title: "Jest",
      description: "API testing",
      published: false
    });
  });

  test("rejects empty create requests", async () => {
    const response = await request(app)
      .post("/api/tutorials")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Content can not be empty!" });
    expect(mockTutorialModel.create).not.toHaveBeenCalled();
  });

  test("updates a tutorial", async () => {
    mockTutorialModel.updateById.mockImplementation((id, tutorial, callback) => {
      callback(null, { id: Number(id), ...tutorial });
    });

    const response = await request(app)
      .put("/api/tutorials/7")
      .send({ title: "Updated", description: "Updated description", published: true });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 7,
      title: "Updated",
      description: "Updated description",
      published: true
    });
  });

  test("rejects empty update requests", async () => {
    const response = await request(app)
      .put("/api/tutorials/7")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Content can not be empty!" });
    expect(mockTutorialModel.updateById).not.toHaveBeenCalled();
  });

  test("deletes a tutorial", async () => {
    mockTutorialModel.remove.mockImplementation((id, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).delete("/api/tutorials/7");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Tutorial was deleted successfully!" });
  });

  test("deletes all tutorials", async () => {
    mockTutorialModel.removeAll.mockImplementation(callback => {
      callback(null, { affectedRows: 2 });
    });

    const response = await request(app).delete("/api/tutorials");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "All Tutorials were deleted successfully!" });
  });

  test("returns 500 when the database read fails", async () => {
    mockTutorialModel.getAll.mockImplementation((title, callback) => {
      callback(new Error("database error"), null);
    });

    const response = await request(app).get("/api/tutorials");

    expect(response.status).toBe(500);
    expect(response.body.message).toContain("database error");
  });

  test("returns 404 when a tutorial is missing", async () => {
    mockTutorialModel.findById.mockImplementation((id, callback) => {
      callback({ kind: "not_found" }, null);
    });

    const response = await request(app).get("/api/tutorials/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toContain("Not found Tutorial with id 999");
  });
});