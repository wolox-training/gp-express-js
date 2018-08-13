exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      url: process.env.NODE_API_DB_URL,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    session: {
      secret: 'some-super-secret'
    }
  }
};
