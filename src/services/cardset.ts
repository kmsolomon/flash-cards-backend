// update set -- set details or add/remove cards?
// get set and include associated cards
// get all sets
import { CardSet } from "../models";

export const create = async (cardSet: CardSet) => {
  return await CardSet.create(cardSet);
};

export const getSet = async (id: string) => {
  return await CardSet.findByPk(id);
};

export const remove = async (id: string) => {
  return await CardSet.destroy({ where: { id: id } });
};
