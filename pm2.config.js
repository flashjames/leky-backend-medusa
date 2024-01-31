module.exports = {
  apps : [
    {
      name: "backend_medusa",
      script: "./index.js",
      instances : "max",
      exec_mode : "cluster",

    }
  ],
  // Stop the process on CTRL+C
}
