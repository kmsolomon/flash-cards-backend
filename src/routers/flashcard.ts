import express from "express";
import * as flashCardService from "../services/flashcard";
import { FlashCard } from "models";
import { isValidUUIDV4 } from "../utils/utils";

const router = express.Router();

const NOTFOUND = { error: "Flash card not found." };

router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidUUIDV4(req.params.id)) {
      return res.status(404).send(NOTFOUND);
    }

    const flashcard = await flashCardService.getCard(req.params.id);

    if (!flashcard) {
      return res.status(404).send(NOTFOUND);
    }

    return res.status(200).json(flashcard);
  } catch (err) {
    return next(err);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const cards = await flashCardService.getAll();
    return res.status(200).json(cards);
  } catch (err) {
    return next(err);
  }
});

function parsePartialFlashCard(obj: unknown): Partial<FlashCard> {
  const card: Partial<FlashCard> = {};
  if (typeof obj !== "object" || obj === null) {
    const err = new Error("Invalid data for flash card update.");
    err.name = "ParseError";
    throw err;
  }
  if ("question" in obj && isString(obj.question)) {
    if (obj.question.length > 150) {
      const err = new Error("Question max length (150) exceeded.");
      err.name = "ParseError";
      throw err;
    }
    card.question = obj.question;
  }

  if ("answer" in obj && isString(obj.answer)) {
    if (obj.answer.length > 1000) {
      const err = new Error("Answer max length (1000) exceeded.");
      err.name = "ParseError";
      throw err;
    }
    card.answer = obj.answer;
  }
  return card;
}

router.post("/", async (req, res, next) => {
  try {
    const card = parsePartialFlashCard(req.body);

    if (!("question" in card) || !("answer" in card)) {
      return res
        .status(400)
        .json({ error: "Could not create flash card. Invalid data format." });
    }

    const flashcard = await flashCardService.create(card as FlashCard);
    return res.status(201).json(flashcard);
  } catch (err) {
    return next(err);
  }
});

function isString(text: unknown): text is string {
  return typeof text === "string" || text instanceof String;
}

router.put("/:id", async (req, res, next) => {
  try {
    if (!isValidUUIDV4(req.params.id)) {
      return res.status(404).send(NOTFOUND);
    }

    // may want to move the validation later
    const partialCard = parsePartialFlashCard(req.body);

    const updatedCard = await flashCardService.update(
      req.params.id,
      partialCard
    );

    if (!updatedCard) {
      return res.status(404).send(NOTFOUND);
    }

    return res.status(200).send(updatedCard);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidUUIDV4(req.params.id)) {
      return res.status(404).send(NOTFOUND);
    }

    const removeCard = await flashCardService.remove(req.params.id);

    if (removeCard === 0) {
      return res.status(404).send(NOTFOUND);
    } else {
      return res.status(200).send({ message: "Flash card deleted." });
    }
  } catch (err) {
    return next(err);
  }
});

export default router;
