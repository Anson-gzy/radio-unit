import { loadEnvFile } from './src/02-local-brain/context.js';
import { createRadioServer } from './src/02-local-brain/router.js';

loadEnvFile();

const port = Number(process.env.PORT || 4173);
const server = createRadioServer({ port });

server.listen(port, () => {
  console.log(`Sonic Particles web is running at http://localhost:${port}`);
});
