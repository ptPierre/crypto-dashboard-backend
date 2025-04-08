const fastify = require('fastify')({ logger: true });
const config = require('./config/config');
const connectDB = require('./utils/db');

// Register plugins
fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
  credentials: true
});

// Register authentication plugin
fastify.register(require('./plugins/authenticate'));

// Register routes
fastify.register(require('./routes/auth'), { prefix: `${config.api.prefix}/auth` });
fastify.register(require('./routes/favorites'), { prefix: `${config.api.prefix}/favorites` });

// Health check route
fastify.get('/health', async (request, reply) => {
  return { status: 'OK' };
});

// Start server only after DB connection
const start = async () => {
  try {
    // Connect to MongoDB first
    const dbConnected = await connectDB();
    
    if (dbConnected) {
      // Then start the server
      await fastify.listen({
        port: config.server.port,
        host: config.server.host
      });
      fastify.log.info(`Server is running on ${config.server.host}:${config.server.port}`);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 