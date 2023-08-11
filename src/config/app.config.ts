export default () => ({
  app: {
    secret: process.env.APP_SECRET,
    host: process.env.APP_HOST,
  },
});
