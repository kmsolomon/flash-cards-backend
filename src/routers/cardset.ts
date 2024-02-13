import express from "express";
import * as cardSetService from "../services/cardset";
import { CardSet } from "../models";
import { isString } from "../utils/utils";
import { isValidUUIDV4 } from "../utils/utils";

const router = express.Router();

const NOTFOUND = { error: "Card set not found." };

function parsePartialCardSet(obj: unknown): Partial<CardSet> {
  const cardSet: Partial<CardSet> = {};

  if (typeof obj !== "object" || obj === null) {
    const err = new Error("Invalid data for card set.");
    err.name = "ParseError";
    throw err;
  }

  if ("title" in obj && isString(obj.title)) {
    if (obj.title.length > 100) {
      const err = new Error("Title max length (100) exceeded.");
      err.name = "ParseError";
      throw err;
    }
    if (obj.title.trim() === "") {
      const err = new Error("Card set title can not be empty.");
      err.name = "ParseError";
      throw err;
    }
    cardSet.title = obj.title;
  } else if ("title" in obj && !isString(obj.title)) {
    const err = new Error("Card set title must be a string");
    err.name = "ParseError";
    throw err;
  }

  if ("description" in obj && isString(obj.description)) {
    if (obj.description.length > 200) {
      const err = new Error("Description max length (200) exceeded.");
      err.name = "ParseError";
      throw err;
    }
    cardSet.description = obj.description;
  }
  return cardSet;
}

router.post("/", async (req, res, next) => {
  try {
    const parsedData = parsePartialCardSet(req.body);

    if (!("title" in parsedData)) {
      const err = new Error("Card set title can not be null.");
      err.name = "ParseError";
      throw err;
    }

    const cardSet = await cardSetService.create(parsedData as CardSet);

    return res.status(201).json(cardSet);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidUUIDV4(req.params.id)) {
      return res.status(404).send(NOTFOUND);
    }

    const cardSet = await cardSetService.getSet(req.params.id);

    if (!cardSet) {
      return res.status(404).send(NOTFOUND);
    }

    return res.status(200).json(cardSet);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidUUIDV4(req.params.id)) {
      return res.status(404).send(NOTFOUND);
    }

    const removeSet = await cardSetService.remove(req.params.id);

    if (removeSet === 0) {
      return res.status(404).send(NOTFOUND);
    } else {
      return res.status(200).send({ message: "Card set deleted." });
    }
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!isValidUUIDV4(req.params.id)) {
      return res.status(404).send(NOTFOUND);
    }

    const setUpdates = parsePartialCardSet(req.body);

    const updated = await cardSetService.update(req.params.id, setUpdates);

    if (!updated) {
      return res.status(404).send(NOTFOUND);
    }

    return res.status(200).send(updated);
  } catch (err) {
    return next(err);
  }
});

export default router;
