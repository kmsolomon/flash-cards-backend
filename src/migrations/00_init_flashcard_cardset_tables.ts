import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../utils/db";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("cardsets", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
    },
  });
  await queryInterface.createTable("flashcards", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING(150),
    },
    answer: {
      type: DataTypes.STRING(1000),
    },
  });
  await queryInterface.addColumn("flashcards", "cardset_id", {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "cardsets", key: "id" },
    onDelete: "CASCADE",
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("flashcards");
  await queryInterface.dropTable("cardsets");
};
