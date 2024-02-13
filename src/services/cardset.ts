// create set
// update set -- set details or add/remove cards?
// delete set
// get set
// get all sets
import { CardSet } from "../models";

export const create = async (cardSet: CardSet) => {
  return await CardSet.create(cardSet);
};

export const getSet = async (id: string) => {
  return await CardSet.findByPk(id);
};
