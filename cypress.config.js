const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: true,

  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:3000/api'
  },
});
