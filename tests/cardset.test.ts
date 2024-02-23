import { describe, expect, test, beforeEach } from "@jest/globals";
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

describe("/api/cardset", () => {
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

    test("When creating a card set with a null value for the title field, it should return a 400 response", async () => {
      const setData = {
        title: null,
      };

      const response = await axiosClient.post(baseURL, setData);

      expect(response.status).toBe(400);
    });

    test("When creating a card set with a blank string for the title field, it should return a 400 response", async () => {
      const setData = {
        title: "    ",
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
  describe("GET /", () => {
    test("When fetching all card sets, it should retrieve them and get a 200 response", async () => {
      const setData = {
        title: "One",
      };
      const setData2 = {
        title: "Two",
      };

      await axiosClient.post(baseURL, setData);
      await axiosClient.post(baseURL, setData2);
      const getResponse = await axiosClient.get(baseURL);

      expect(getResponse.status).toBe(200);
      expect(Array.isArray(getResponse.data)).toBeTruthy();
      expect(getResponse.data.length).toBeGreaterThanOrEqual(2);
      expect(getResponse.data[0].cards).toBeDefined(); // confirm cards attribute is showing up
    });
  });
  describe("GET /:id", () => {
    test("When fetching an existing card set, it should retrieve it and get a 200 response", async () => {
      const cardSetData = {
        title: "Fetching card set test",
      };

      const postResponse = await axiosClient.post(baseURL, cardSetData);
      const getResponse = await axiosClient.get(
        `${baseURL}/${postResponse.data.id}`
      );

      expect(getResponse).toMatchObject({
        status: 200,
        data: {
          ...cardSetData,
          flashcards: [],
        },
      });
    });

    test("When fetching a card set with an invalid ID, it should get a 404 response", async () => {
      const nonExistingId = -1;
      const response = await axiosClient.get(`${baseURL}/${nonExistingId}`);
      expect(response.status).toBe(404);
    });
  });
  describe("DELETE /:id", () => {
    test("When deleting a card set it should return a 200 response", async () => {
      const setData = {
        title: "Deleting test",
      };

      const postResponse = await axiosClient.post(baseURL, setData);
      const deleteResponse = await axiosClient.delete(
        `${baseURL}/${postResponse.data.id}`
      );

      expect(deleteResponse).toMatchObject({
        status: 200,
        data: {
          message: "Card set deleted.",
        },
      });

      const getResponse = await axiosClient.get(
        `${baseURL}/${postResponse.data.id}`
      );

      expect(getResponse.status).toBe(404);
    });
    test("Trying to delete a card that doesn't exist returns a 404 response", async () => {
      const setData = {
        title: "Deleting test",
      };

      const postResponse = await axiosClient.post(baseURL, setData);
      const deleteResponse = await axiosClient.delete(
        `${baseURL}/${postResponse.data.id}`
      );

      expect(deleteResponse).toMatchObject({
        status: 200,
        data: {
          message: "Card set deleted.",
        },
      });

      const getResponse = await axiosClient.delete(
        `${baseURL}/${postResponse.data.id}`
      );

      expect(getResponse.status).toBe(404);
    });
    test("Trying to use an invalid ID to delete a card returns a 404 response", async () => {
      const deleteResponse = await axiosClient.delete(`${baseURL}/-1`);
      expect(deleteResponse.status).toBe(404);
    });
  });
  describe("PUT /:id", () => {
    let id = "";
    beforeEach(async () => {
      const setData = {
        title: "Update Test Suite",
      };

      const response = await axiosClient.post(baseURL, setData);
      id = response.data.id;
    });
    test("When updating the card set title and description it should return the updated object with a 200 response", async () => {
      const updates = {
        title: "Updated!",
        description: "Updated!!!",
      };

      const response = await axiosClient.put(`${baseURL}/${id}`, updates);
      expect(response).toMatchObject({
        status: 200,
        data: {
          ...updates,
        },
      });
    });
    test("When updating only the card set title it should return the updated object with a 200 response", async () => {
      const updates = {
        title: "My fancy title",
      };

      const response = await axiosClient.put(`${baseURL}/${id}`, updates);
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: updates.title,
          description: null,
        },
      });
    });
    test("When updating only the card set description it should return the updated object with a 200 response", async () => {
      const updates = {
        description: "My fancy description",
      };

      const response = await axiosClient.put(`${baseURL}/${id}`, updates);
      expect(response).toMatchObject({
        status: 200,
        data: {
          title: "Update Test Suite",
          description: updates.description,
        },
      });
    });
    test("When trying to update the card set title to something longer than the max length it should return a 400 response", async () => {
      const updates = {
        title: "a".repeat(101),
      };

      const response = await axiosClient.put(`${baseURL}/${id}`, updates);
      expect(response.status).toBe(400);
    });
    test("When trying to update the card set description to something longer than the max length it should return a 400 response", async () => {
      const updates = {
        description: "b".repeat(201),
      };

      const response = await axiosClient.put(`${baseURL}/${id}`, updates);
      expect(response.status).toBe(400);
    });
    test("When trying to update the card set title to an empty string it should return a 400 response", async () => {
      const updates = {
        title: "   ",
      };

      const response = await axiosClient.put(`${baseURL}/${id}`, updates);
      expect(response.status).toBe(400);
    });
    test("When trying to update the card set title to null it should return a 400 response", async () => {
      const updates = {
        title: null,
      };

      const response = await axiosClient.put(`${baseURL}/${id}`, updates);
      expect(response.status).toBe(400);
    });
  });
});
