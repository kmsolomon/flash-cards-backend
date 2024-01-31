import FlashCard from "./flashcard";
import CardSet from "./cardset";
import CardSetAssociation from "./cardsetassociation";

CardSet.belongsToMany(FlashCard, { through: CardSetAssociation });
FlashCard.belongsToMany(CardSet, { through: CardSetAssociation });

export { FlashCard, CardSet, CardSetAssociation };
