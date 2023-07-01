export default () => ({
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    tls: Boolean(process.env.MAIL_TLS_ENABLED),
  },
});
