import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../utils/db";

class CardSet extends Model<
  InferAttributes<CardSet>,
  InferCreationAttributes<CardSet>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: CreationOptional<string>;
}

CardSet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "cardset",
  }
);

export default CardSet;
