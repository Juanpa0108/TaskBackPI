import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.FRONTEND_URL || "http://localhost:5173"];

    // si levantas sin frontend, permitir undefined (cuando Postman/Insomnia no mandan origin)
    if (process.argv[2] === "--api") {
      whiteList.push(undefined as any);
    }

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
  credentials: true, // ⚡ importante para que funcione con cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
