import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });


export const {
    PORT,
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    EMAIL_SERVICE,
    EMAIL_USER,
    EMAIL_PASSWORD,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN,

} = process.env;