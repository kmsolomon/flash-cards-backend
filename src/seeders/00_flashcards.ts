import { Migration } from "../utils/db";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.bulkInsert("cardsets", [
    {
      id: "2a764ecd-01c5-4818-8ab0-6a8a82a486dd",
      title: "JavaScript Quiz",
      description: "Trivia-style questions about JavaScript.",
    },
    {
      id: "2a764ecd-01c5-4818-8ab0-6a8a82a486da",
      title: "Empty Set",
    },
  ]);

  await queryInterface.bulkInsert("flashcards", [
    {
      cardset_id: "2a764ecd-01c5-4818-8ab0-6a8a82a486dd",
      question: "What is a lexical context?",
      answer:
        "The area of code where values/variables/functions and expressions are “visible” or can be referenced.",
    },
    {
      cardset_id: "2a764ecd-01c5-4818-8ab0-6a8a82a486dd",
      question: "What is a static method on a Class?",
      answer:
        "A method that is defined on the class itself using the static keyword. It can only be accessed on the class itself, not on instances of the class. For example Math.floor().",
    },
    {
      cardset_id: "2a764ecd-01c5-4818-8ab0-6a8a82a486dd",
      question: 'What is the difference between "==" and "==="?',
      answer:
        "=== checks for strict equality, meaning it checks both type and value (does not do type conversion). == abstract equality operator, will do a type conversion before comparing.",
    },
    {
      cardset_id: "2a764ecd-01c5-4818-8ab0-6a8a82a486dd",
      question: "What does * {box-sizing: border-box;} do?",
      answer:
        "Sets all elements to use box-sizing: border-box for calculating width and height. This changes it so that border and padding are included in the calculation for width and height.",
    },
    {
      cardset_id: "2a764ecd-01c5-4818-8ab0-6a8a82a486dd",
      question:
        "Why are rems or ems preferable to pixels for setting type size?",
      answer:
        "Because if a user has set their browsers default font size then using rem/em will respect that and be relative to that value. Whereas px would remain the same size",
    },
    {
      cardset_id: "2a764ecd-01c5-4818-8ab0-6a8a82a486dd",
      question:
        "Why is it important to allow the viewport to be resized and/or zoomed?",
      answer:
        "Users with low vision may prefer to zoom into page content to make it easier to read.",
    },
  ]);
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("flashcards");
  await queryInterface.dropTable("cardsets");
};
