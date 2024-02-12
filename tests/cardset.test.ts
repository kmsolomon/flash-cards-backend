import { describe, expect, test } from "@jest/globals";
import axios, { Axios } from "axios";
import * as dotenv from "dotenv";
import { isValidUUIDV4 } from "../src/utils/utils";

dotenv.config();

let axiosClient: Axios;
const baseURL = "/api/cardset";

beforeAll(async () => {
  const axiosConfig = {
    baseURL: `${process.env.URL}:${process.env.PORT}`,
    validateStatus: () => true,
  };
  axiosClient = axios.create(axiosConfig);
});

describe("/api/flashcard", () => {
  describe("POST", () => {
    test("When creating a card set with valid data, it should return the created object and get a 201 response", async () => {
      const setData = {
        title: "Testing",
        description: "Testing stuff",
      };

      const response = await axiosClient.post(baseURL, setData);

      expect(response).toMatchObject({
        status: 201,
        data: {
          id: expect.any(String),
          title: setData.title,
          description: setData.description,
        },
      });

      expect(isValidUUIDV4(response.data.id)).toBeTruthy();
    });

    test("Can create a card set without including a description, and should get the created object and a 201 response", async () => {
      const setData = {
        title: "No need to describe",
      };

      const response = await axiosClient.post(baseURL, setData);

      expect(response).toMatchObject({
        status: 201,
        data: {
          id: expect.any(String),
          title: setData.title,
          description: null,
        },
      });
    });

    test("When creating a card set when missing the title field, it should return a 400 response", async () => {
      const setData = {
        description: "I forgot a title",
      };

      const response = await axiosClient.post(baseURL, setData);

      expect(response.status).toBe(400);
    });

    test("If the card set title is over 100 characters, it should return a 400 response", async () => {
      const cardSetData = {
        title: "a".repeat(101),
      };

      const response = await axiosClient.post(baseURL, cardSetData);

      expect(response.status).toBe(400);
    });

    test("If the card set description is over 200 characters, it should return a 400 response", async () => {
      const cardSetData = {
        title: "foo",
        description: "b".repeat(201),
      };

      const response = await axiosClient.post(baseURL, cardSetData);

      expect(response.status).toBe(400);
    });
  });
});
