const app = require('./app'); // app.js está en la raíz, importamos directamente
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor de la API corriendo en http://localhost:${PORT}`);
});