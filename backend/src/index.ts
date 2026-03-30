import 'dotenv/config';
import app from './app';
import dataSource from './database/data-source';

const PORT = process.env.PORT || 6000;
const NODE_ENV = process.env.NODE_ENV || 'development';

dataSource.initialize()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database connection initialized successfully.');

    const server = app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`\n========================================`);
      // eslint-disable-next-line no-console
      console.log(`Maternal Health Chatbot API`);
      // eslint-disable-next-line no-console
      console.log(`Environment: ${NODE_ENV}`);
      // eslint-disable-next-line no-console
      console.log(`Port: ${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`API Prefix: ${process.env.API_PREFIX || '/api/v1'}`);
      // eslint-disable-next-line no-console
      console.log(`========================================\n`);
    });

    process.on('unhandledRejection', (err: Error) => {
      // eslint-disable-next-line no-console
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      // eslint-disable-next-line no-console
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('SIGTERM', () => {
      // eslint-disable-next-line no-console
      console.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error initializing database connection:', error);
    process.exit(1);
  });



export default app;
