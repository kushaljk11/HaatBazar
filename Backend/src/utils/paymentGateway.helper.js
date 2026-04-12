import crypto from "crypto";

export const generateUniqueId = () =>
  `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export const generateHmacSha256Hash = (data, secret) => {
  if (!data || !secret) {
    throw new Error("Both data and secret are required to generate a hash");
  }

  return crypto.createHmac("sha256", secret).update(data).digest("base64");
};
