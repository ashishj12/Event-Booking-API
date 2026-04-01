import app from './app.js';
import { initDB } from './config/db.js';

const PORT = process.env.PORT ?? 3000;
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
