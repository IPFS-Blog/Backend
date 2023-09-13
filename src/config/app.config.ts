export default () => ({
  app: {
    env: process.env.NODE_ENV,
    secret: process.env.APP_SECRET,
    host: process.env.APP_HOST,
  },
  group: {
    email: process.env.APP_AUTHOR_GROUP,
  },
});
