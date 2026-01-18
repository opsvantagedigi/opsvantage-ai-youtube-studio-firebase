import server from './api/index.js';
import { bullBoardApp } from './bull-board/server.js';
import middie from '@fastify/middie';

const start = async () => {
  try {
    await server.register(middie);
    server.after(() => {
      server.use('/admin/queues', bullBoardApp);
    });
    await server.listen({ port: 3001 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
