import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../utils/db";
import CardSet from "./cardset";

class FlashCard extends Model<
  InferAttributes<FlashCard>,
  InferCreationAttributes<FlashCard>
> {
  declare id: CreationOptional<string>;
  declare cardsetId: ForeignKey<CardSet["id"]>;
  declare question: string;
  declare answer: string;
}

FlashCard.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "flashcard",
  }
);

export default FlashCard;
