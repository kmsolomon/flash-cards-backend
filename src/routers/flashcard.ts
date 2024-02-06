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

router.post("/", async (req, res, next) => {
  try {
    const flashcard = await flashCardService.create(req.body as FlashCard);
    return res.status(201).json(flashcard);
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
