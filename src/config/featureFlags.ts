const readBooleanFlag = (value: string | undefined, fallback = false) => {
  if (value == null) return fallback;

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

export const featureFlags = {
  v2Enabled: readBooleanFlag(import.meta.env.VITE_ENABLE_V2_ROUTES, true),
  v2Default: readBooleanFlag(import.meta.env.VITE_V2_DEFAULT, false),
};
