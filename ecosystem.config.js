// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "db-sync-service",
      script: "sync-service.js",
      watch: true,
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
