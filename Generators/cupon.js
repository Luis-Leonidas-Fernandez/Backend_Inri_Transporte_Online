import crypto from "crypto";
import { response } from "express";

function randomValueHex(len) {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString("hex") // convert to hexadecimal format
    .slice(0, len)
    .toUpperCase();
  // return required number of characters
}

export const generateVaucher = async (res = response) => {
  const vaucher =
    randomValueHex(4) + "-" + randomValueHex(4) + "-" + randomValueHex(4);
  return vaucher;
};
