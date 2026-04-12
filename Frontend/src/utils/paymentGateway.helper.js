export const generateUniqueId = () =>
  `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export const base64Decode = (base64) => {
  if (!base64) {
    return null;
  }

  try {
    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};
