import FlashCard from "./flashcard";
import CardSet from "./cardset";

CardSet.hasMany(FlashCard);
FlashCard.belongsTo(CardSet, { onDelete: "cascade" });

export { FlashCard, CardSet };
