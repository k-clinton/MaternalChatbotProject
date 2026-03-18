import 'dotenv/config';
import app from './app';
import dataSource from './database/data-source';

const PORT = process.env.PORT || 6000;
const NODE_ENV = process.env.NODE_ENV || 'development';

dataSource.initialize()
  .then(() => {
    console.log('Database connection initialized successfully.');

    const server = app.listen(PORT, () => {
      console.log(`\n========================================`);
      console.log(`Maternal Health Chatbot API`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Port: ${PORT}`);
      console.log(`API Prefix: ${process.env.API_PREFIX}`);
      console.log(`========================================\n`);
    });

    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('SIGTERM', () => {
      console.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error('Error initializing database connection:', error);
    process.exit(1);
  });



export default app;
