module.exports = {
  apps: [
    {
      name: "foodly-service",
      script: "pnpm",
      args: "run start",
      // exec_mode: 'cluster', // Use cluster mode for better performance, not show log
      restart_delay: 4000,
      max_restarts: 10,
      // watch: [".next"], // Restart on changes in the next folder
      ignore_watch: ["node_modules"], // Ignore node_modules folder
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
