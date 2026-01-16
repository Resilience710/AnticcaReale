module.exports = {
  apps: [
    {
      name: 'anticca',
      script: 'npx',
      args: 'serve dist -l 3000 -s',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
