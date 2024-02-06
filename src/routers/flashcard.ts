import express from "express";
import * as flashCardService from "../services/flashcard";
import { FlashCard } from "models";
import { isValidUUIDV4 } from "../utils/utils";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidUUIDV4(req.params.id)) {
      return res.status(404).send({ error: "Flash card not found" });
    }

    const flashcard = await flashCardService.getCard(req.params.id);

    if (!flashcard) {
      return res.status(404).send({ error: "Flash card not found" });
    }

    return res.status(200).json(flashcard);
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const flashcard = await flashCardService.create(req.body as FlashCard);
    res.status(201).json(flashcard);
  } catch (err) {
    return next(err);
  }
});

export default router;
