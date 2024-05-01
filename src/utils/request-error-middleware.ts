import type { ErrorRequestHandler } from "express";

const handleError: ErrorRequestHandler = (error, _req, res, next) => {
  console.error("Error name: ", error.name);
  console.error("Error message: ", error.message);
  if (error.name === "SequelizeValidationError") {
    return res
      .status(400)
      .send({ error: `Invalid or missing data. ${error.message}` });
  } else if (error.name === "SequelizeDatabaseError") {
    return res.status(400).send({
      error: `Provided data was of incorrect type -- ${error.message}`,
    });
  } else if (error.name === "ParseError") {
    return res.status(400).send({
      error: `ParseError: ${error.message}`,
    });
  } else if (error.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).send({
      error: `Provided data was incorrect or missing fields`,
    });
  }
  return next(error);
};

export { handleError };
