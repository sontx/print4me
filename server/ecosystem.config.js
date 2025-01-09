module.exports = {
  apps: [
    {
      name: 'print4me',
      script: 'dist/src/main.js', // Path to your compiled NestJS entry file
      instances: 2, // Number of instances you want to run
      exec_mode: 'cluster', // Use cluster mode to run multiple instances
      autorestart: true,
      watch: false,
      max_memory_restart: '850M',
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      instance_var: 'INSTANCE_ID', // Use INSTANCE_ID to differentiate instances
    },
  ],
};
