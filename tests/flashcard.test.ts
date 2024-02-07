import { describe, expect, test } from "@jest/globals";
import axios, { Axios } from "axios";
import * as dotenv from "dotenv";
import { isValidUUIDV4 } from "../src/utils/utils";

dotenv.config();

let axiosClient: Axios;
const baseURL = "/api/flashcard";

beforeAll(async () => {
  const axiosConfig = {
    baseURL: `${process.env.URL}:${process.env.PORT}`,
    validateStatus: () => true,
  };
  axiosClient = axios.create(axiosConfig);
});

describe("/api/flashcard", () => {
  describe("POST", () => {
    test("When creating a flash card with valid data, it should return the created object and get a 201 response", async () => {
      const flashCardData = {
        question: "What does TDD stand for?",
        answer: "Test driven development.",
      };

      const response = await axiosClient.post(baseURL, flashCardData);

      expect(response).toMatchObject({
        status: 201,
        data: {
          id: expect.any(String),
          question: flashCardData.question,
          answer: flashCardData.answer,
        },
      });

      expect(isValidUUIDV4(response.data.id)).toBeTruthy();
    });

    test("When creating a flash card when missing a field, it should return a 400 response", async () => {
      const flashCardData = {
        question: "What does TDD stand for?",
      };

      const response = await axiosClient.post(baseURL, flashCardData);

      expect(response.status).toBe(400);
    });

    test("If the flash card question is over 150 characters, it should return a 400 response", async () => {
      const flashCardData = {
        question: "a".repeat(151),
        answer: "foo",
      };

      const response = await axiosClient.post(baseURL, flashCardData);

      expect(response.status).toBe(400);
    });

    test("If the flash card answer is over 1000 characters, it should return a 400 response", async () => {
      const flashCardData = {
        question: "foo",
        answer: "b".repeat(1001),
      };

      const response = await axiosClient.post(baseURL, flashCardData);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /:id", () => {
    test("When fetching an existing flash card, it should retrieve it and get a 200 response", async () => {
      const flashCardData = {
        question: "Fetching flash card test",
        answer: "Test test test",
      };

      const postResponse = await axiosClient.post(baseURL, flashCardData);
      const getResponse = await axiosClient.get(
        `${baseURL}/${postResponse.data.id}`
      );

      expect(getResponse).toMatchObject({
        status: 200,
        data: {
          ...flashCardData,
        },
      });
    });

    test("When fetching a flash card with an invalid ID, it should get a 404 response", async () => {
      const nonExistingId = -1;
      const response = await axiosClient.get(`${baseURL}/${nonExistingId}`);
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /:id", () => {
    test("When deleting an existing flash card, it should get a 200 response and delete the card", async () => {
      const flashCardData = {
        question: "Deleting flash card test",
        answer: "Test test test",
      };

      const postResponse = await axiosClient.post(baseURL, flashCardData);
      const deleteResponse = await axiosClient.delete(
        `${baseURL}/${postResponse.data.id}`
      );

      expect(deleteResponse).toMatchObject({
        status: 200,
        data: {
          message: "Flash card deleted.",
        },
      });

      const getResponse = await axiosClient.get(
        `${baseURL}/${postResponse.data.id}`
      );

      expect(getResponse.status).toBe(404);
    });

    test("When trying to delete a card with an invalid id it should return a 404 response.", async () => {
      const nonExistingId = -1;
      const response = await axiosClient.delete(`${baseURL}/${nonExistingId}`);
      expect(response.status).toBe(404);
    });

    test("When trying to delete a card an already deleted card it should return a 404 response.", async () => {
      const flashCardData = {
        question: "Another deleting flash card test",
        answer: "Test test test",
      };

      const postResponse = await axiosClient.post(baseURL, flashCardData);
      await axiosClient.delete(`${baseURL}/${postResponse.data.id}`);
      const secondDeleteResponse = await axiosClient.delete(
        `${baseURL}/${postResponse.data.id}`
      );

      expect(secondDeleteResponse.status).toBe(404);
    });
  });

  describe("PUT", () => {
    test("When updating a flash card with valid data, it should return the updated object and get a 201 response", async () => {
      const flashCardData = {
        question: "What does TDD stand for?",
        answer: "Test driven development.",
      };

      const updatedData = {
        question: "Foo?",
        answer: "Bar!",
      };

      const postResponse = await axiosClient.post(baseURL, flashCardData);
      const response = await axiosClient.put(
        `${baseURL}/${postResponse.data.id}`,
        updatedData
      );

      expect(response).toMatchObject({
        status: 200,
        data: {
          id: postResponse.data.id,
          question: updatedData.question,
          answer: updatedData.answer,
        },
      });
    });

    test("When updating a flash card with a question that exceeds max length, it should return a 400 response", async () => {
      const flashCardData = {
        question: "What does TDD stand for?",
        answer: "Test driven development.",
      };

      const updateQuestion = {
        question: "a".repeat(151),
      };

      const postResponse = await axiosClient.post(baseURL, flashCardData);
      const response = await axiosClient.put(
        `${baseURL}/${postResponse.data.id}`,
        updateQuestion
      );

      expect(response.status).toBe(400);
    });

    test("When updating a flash card with an answer that exceeds max length, it should return a 400 response", async () => {
      const flashCardData = {
        question: "What does TDD stand for?",
        answer: "Test driven development.",
      };

      const updateAnswer = {
        answer: "a".repeat(1001),
      };

      const postResponse = await axiosClient.post(baseURL, flashCardData);
      const response = await axiosClient.put(
        `${baseURL}/${postResponse.data.id}`,
        updateAnswer
      );

      expect(response.status).toBe(400);
    });
  });
});
