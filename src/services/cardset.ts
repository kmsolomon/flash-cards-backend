// update set -- set details or add/remove cards?
// get set and include associated cards
// get all sets
import sequelize from "sequelize";
import { CardSet, FlashCard } from "../models";

export const create = async (cardSet: CardSet) => {
  return await CardSet.create(cardSet);
};

export const getSet = async (id: string) => {
  return await CardSet.findByPk(id, {
    include: {
      model: FlashCard,
      attributes: ["id", "question", "answer"],
    },
  });
};

export const getAll = async () => {
  return await CardSet.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            "(SELECT COUNT(*)::int from flashcards as cards where cards.cardset_id=cardset.id)"
          ),
          "cards",
        ],
      ],
    },
  });
};

export const remove = async (id: string) => {
  return await CardSet.destroy({ where: { id: id } });
};

export const update = async (id: string, updates: Partial<CardSet>) => {
  const cardSet = await getSet(id);

  if (!cardSet) {
    return null;
  }

  if (updates.title) {
    cardSet.title = updates.title;
  }

  if (typeof updates.description !== "undefined") {
    cardSet.description = updates.description;
  }

  return await cardSet.save();
};
