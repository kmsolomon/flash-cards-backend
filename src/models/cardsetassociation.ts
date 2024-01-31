import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../utils/db";
import FlashCard from "./flashcard";
import CardSet from "./cardset";

class CardSetAssociation extends Model<
  InferAttributes<CardSetAssociation>,
  InferCreationAttributes<CardSetAssociation>
> {
  declare cardId: string;
  declare setId: string;
}

CardSetAssociation.init(
  {
    cardId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: FlashCard,
        key: "id",
      },
    },
    setId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: CardSet,
        key: "id",
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "cardsetassociation",
  }
);

export default CardSetAssociation;
