export function normalizePostLocation(input) {
  const city = String(input?.city || "").trim();
  const district = String(input?.district || city || "N/A").trim();

  if (!city) {
    throw new Error("City is required");
  }

  return { city, district };
}
