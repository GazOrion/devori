/** PM2: запуск на Windows-сервере из C:\www\devori */
module.exports = {
  apps: [
    {
      name: "devori",
      cwd: "C:\\www\\devori",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
	  max_memory_restart: '1G',
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
