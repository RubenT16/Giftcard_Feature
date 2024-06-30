import { defineConfig } from "cypress";
import jwt from "jsonwebtoken";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    setupNodeEvents(on, config) {
      on("task", {
        generateToken() {
          const secretKey = "supersecretduckspasswordtokens11**"; // Replace with your actual secret key
          const payload = {
            sub: "User Details",
            iss: "Duck Studios",
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expiration time (1 hour from now)
            iat: Math.floor(Date.now() / 1000),
            email: "aidanverkerk@test2.nl",
          };

          const token = jwt.sign(payload, secretKey);
          return token;
        },
      });
    },
  },
});
