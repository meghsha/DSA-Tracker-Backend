import './database/index.js';
import app from "./app.js";
import { port } from './config.js';

const PORT = port ?? 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
