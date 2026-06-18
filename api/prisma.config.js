const {defineConfig, env} = require('prisma/config')


try{
  process.loadEnvFile();
  } catch (err) {

  }


  module.exports = defineConfig({
    schema: "prisma/schema.prisma",
    migrations: { path: "prisma/migrations" },
    datasource : {
      url: env("DATABASE_URL")
    }
  })