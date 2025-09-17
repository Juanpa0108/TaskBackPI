/**
 * Configuración de CORS para la API.
 *
 * Define los orígenes permitidos, credenciales, métodos y cabeceras que
 * pueden interactuar con el backend. La lista blanca incluye la URL del
 * frontend definida en la variable de entorno `FRONTEND_URL`.
 *
 * Si el backend se levanta con el argumento `--api`, también permite
 * `undefined` como origen (útil para pruebas con Postman/Insomnia).
 *
 * @constant
 * @type {CorsOptions}
 * @property {function(string, function): void} origin - Función que valida si el origen está permitido.
 * @property {boolean} credentials - Indica si se permiten cookies/cabeceras de autorización.
 * @property {string[]} methods - Métodos HTTP permitidos.
 * @property {string[]} allowedHeaders - Cabeceras HTTP permitidas.
 */
export const corsConfig = {
  origin: function (origin, callback) {
    const whiteList = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174"
    ];

    // si levantas sin frontend, permitir undefined (cuando Postman/Insomnia no mandan origin)
    if (process.argv[2] === "--api") {
      whiteList.push(undefined);
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
