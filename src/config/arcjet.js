import { ARCJET_KEY } from "./env.js";
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";

const isDev = process.env.ARCJET_ENV === "development";



const aj = arcjet({
    // Get your site key from https://app.arcjet.com and set it as an environment
    // variable rather than hard coding.
    key: ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
      shield({ mode: "LIVE" }),
      detectBot({
        mode: isDev ? "DRY_RUN" : "LIVE", 
        allow: [
          "CATEGORY:SEARCH_ENGINE", 
        ],
      }),
      tokenBucket({
        mode: "LIVE",
        refillRate: 5, 
        interval: 10, 
        capacity: 10,
      }),
    ],
  });

export default aj