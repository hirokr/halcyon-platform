// API Configuration for different environments
const API_CONFIG = {
  development: {
    BASE_URL: "http://localhost:3000",
  },
  production: {
    BASE_URL: "https://halcyon-api.vercel.app", // Update with your actual API domain
  },
};

// Get current environment
const ENV =
  window.location.hostname === "localhost" ? "development" : "production";
const API_BASE_URL = API_CONFIG[ENV].BASE_URL;

// Export for use in main.js
window.API_BASE_URL = API_BASE_URL;

console.log(`Environment: ${ENV}, API Base URL: ${API_BASE_URL}`);
