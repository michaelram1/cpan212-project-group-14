import { app } from './app.js';
import { connectDB } from './db.js';
const port = Number(process.env.PORT || 4000);
try {
  await connectDB();
  app.listen(port, () => console.log(`TripTally API ready at http://localhost:${port}`));
} catch (error) {
  console.error('Database startup failed:', error.message);
  process.exit(1);
}
