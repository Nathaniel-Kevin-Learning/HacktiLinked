const Redis = require('ioredis');
const redis = new Redis({
  port: 15931, // Redis port
  host: process.env.REDIS_ENDPOINT, // Redis host
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis;
