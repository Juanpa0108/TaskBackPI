/**
 * CORS Configuration for the API
 *
 * Defines the allowed origins, credentials, methods, and headers that
 * can interact with the backend. The whitelist includes the frontend URL
 * defined in the environment variable `FRONTEND_URL`.
 *
 * If the backend is started with the `--api` argument, it also allows
 * `undefined` as an origin (useful for testing with Postman/Insomnia).
 * @constant
 * @type {CorsOptions}
 * @property {function(string, function): void} origin - Function that validates whether the origin is allowed.
 * @property {boolean} credentials - Indicates whether cookies/authorization headers are allowed.
 * @property {string[]} methods - Allowed HTTP methods.
 * @property {string[]} allowedHeaders - Cabeceras HTTP permitidas.
 */
export const corsConfig = {
  origin: function (origin, callback) {
    const whiteList = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174"
    ];

    // if you start without a frontend, allow undefined (when Postman/Insomnia do not send an origin)

    if (process.argv[2] === "--api") {
      whiteList.push(undefined);
    }

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
  credentials: true, // important for it to work with cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
