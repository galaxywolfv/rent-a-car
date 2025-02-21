const http = require('http');

const app = require('./app');
require('dotenv').config();

const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT || 4001;

server.listen(port, () => console.log(`Server is running on port: \x1b[32m${port}\x1b[0m`));
