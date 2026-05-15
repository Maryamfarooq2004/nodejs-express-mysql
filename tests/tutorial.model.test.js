const mockDb = {
  query: jest.fn()
};

jest.mock("../app/models/db.js", () => mockDb);

const Tutorial = require("../app/models/tutorial.model.js");

describe("tutorial model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a tutorial with an insert query", done => {
    mockDb.query.mockImplementation((sql, data, callback) => {
      callback(null, { insertId: 15 });
    });

    Tutorial.create(
      { title: "Database test", description: "Uses mocked mysql", published: false },
      (err, result) => {
        expect(err).toBeNull();
        expect(result).toEqual({
          id: 15,
          title: "Database test",
          description: "Uses mocked mysql",
          published: false
        });
        expect(mockDb.query).toHaveBeenCalledWith(
          "INSERT INTO tutorials SET ?",
          { title: "Database test", description: "Uses mocked mysql", published: false },
          expect.any(Function)
        );
        done();
      }
    );
  });

  test("finds a tutorial by id using a select query", done => {
    mockDb.query.mockImplementation((sql, callback) => {
      callback(null, [{ id: 4, title: "Found tutorial" }]);
    });

    Tutorial.findById(4, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({ id: 4, title: "Found tutorial" });
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT * FROM tutorials WHERE id = 4",
        expect.any(Function)
      );
      done();
    });
  });

  test("removes a tutorial by id using a delete query", done => {
    mockDb.query.mockImplementation((sql, id, callback) => {
      callback(null, { affectedRows: 1 });
    });

    Tutorial.remove(9, (err, result) => {
      expect(err).toBeNull();
      expect(result).toEqual({ affectedRows: 1 });
      expect(mockDb.query).toHaveBeenCalledWith(
        "DELETE FROM tutorials WHERE id = ?",
        9,
        expect.any(Function)
      );
      done();
    });
  });
});