// get 1 card
// get all cards
// update card
// add card
// remove card

import { FlashCard } from "../models";

export const create = async (flashcard: FlashCard) => {
  return await FlashCard.create(flashcard);
};

export const getCard = async (id: string) => {
  return await FlashCard.findByPk(id);
};
