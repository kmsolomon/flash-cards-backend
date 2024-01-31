import { DataTypes } from "sequelize";
import { Migration } from "../utils/db";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("cardsetassociation", {
    cardId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "flashcards",
        key: "id",
      },
    },
    setId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "cardsets",
        key: "id",
      },
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("cardsetassociation");
};
