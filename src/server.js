const { createServer } = require("./app");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

createServer().listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});