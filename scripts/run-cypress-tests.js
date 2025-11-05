import cypress from 'cypress';
import serverPromise from './start-server.js';

serverPromise.then(async server => {
  try {
    const results = await cypress.run();
    await server.close();
    process.exit(results.totalFailed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Test error:', error);
    await server.close();
    process.exit(1);
  }
});
