import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../utils/db";

// id: string;
// question: string;
// answer: string;
// createdBy?: string;

class FlashCard extends Model<
  InferAttributes<FlashCard>,
  InferCreationAttributes<FlashCard>
> {
  declare id: CreationOptional<string>;
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
