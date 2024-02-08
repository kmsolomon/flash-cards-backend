import { FlashCard } from "../models";

export const create = async (flashcard: FlashCard) => {
  return await FlashCard.create(flashcard);
};

export const getCard = async (id: string) => {
  return await FlashCard.findByPk(id);
};

export const getAll = async () => {
  return await FlashCard.findAll();
};

export const remove = async (id: string) => {
  return await FlashCard.destroy({ where: { id: id } });
};

export const update = async (id: string, cardUpdates: Partial<FlashCard>) => {
  const flashCard = await getCard(id);

  if (!flashCard) {
    return null;
  }

  if (cardUpdates.question) {
    flashCard.question = cardUpdates.question;
  }

  if (cardUpdates.answer) {
    flashCard.answer = cardUpdates.answer;
  }

  return await flashCard.save();
};
