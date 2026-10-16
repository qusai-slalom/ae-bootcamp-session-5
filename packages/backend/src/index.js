const app = require('./app');

const PORT = process.env.PORT || 3001;

// INTENTIONAL ISSUE: Missing error handling for server startup
app.listen(PORT, () => {
  process.stdout.write(`Server running on port ${PORT}\n`);
});
