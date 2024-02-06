import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";

export const isValidUUIDV4 = (id: string): boolean => {
  return uuidValidate(id) && uuidVersion(id) === 4;
};
