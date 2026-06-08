import { getRequestConfig } from "next-intl/server";
import en from "./en.json";

// EN-only for the Phase 1 demo. ZH is a drop-in later: add zh.json and a locale switch.
export default getRequestConfig(async () => ({
  locale: "en",
  messages: en,
}));
