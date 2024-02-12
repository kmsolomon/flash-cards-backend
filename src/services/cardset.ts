// create set
// update set -- set details or add/remove cards?
// delete set
// get set
// get all sets
import { CardSet } from "../models";

export const create = async (cardSet: CardSet) => {
  return await CardSet.create(cardSet);
};
