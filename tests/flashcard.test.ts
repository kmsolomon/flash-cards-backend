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
    test("When creating an flash card with valid data, it should return the created object and get a 201 response", async () => {
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

    test("When creating an flash card when missing a field, it should return a 400 response", async () => {
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
});
