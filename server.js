const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const apiRoutes = require("./routes/api");
const nasaDataService = require("./services/nasaDataService");

const app = express();
const PORT = process.env.PORT || 3000;
const ee = require("@google/earthengine");

// Google Earth Engine Authentication - Production Safe
let privateKey;
try {
  if (process.env.NODE_ENV === "production") {
    // In production, use environment variables
    privateKey = {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    };
  } else {
    // In development, use JSON file
    privateKey = require("./unpaid-usage-473921-3933d28a9a72.json");
  }

  ee.data.authenticateViaPrivateKey(
    privateKey,
    () => {
      console.log("Earth Engine authentication successful.");
      ee.initialize(
        null,
        null,
        () => {
          console.log("Earth Engine client library initialized.");
        },
        (err) => {
          console.error("Earth Engine initialization error:", err);
        }
      );
    },
    (err) => {
      console.error("Earth Engine authentication error:", err);
    }
  );
} catch (error) {
  console.error("Earth Engine setup error:", error);
}
// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));

// CORS configuration for Vercel deployment

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        process.env.FRONTEND_URL || "https://halcyon-frontend.vercel.app",
        "https://halcyon-platform.vercel.app",
        "https://halcyon-platform-*.vercel.app", // Allow preview deployments
      ]
    : [
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "http://localhost:5173",
      ];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Halcyon Backend API",
  });
});

// Initialize NASA data services
nasaDataService
  .initialize()
  .then(() => {
    console.log("NASA data services initialized successfully");
  })
  .catch((error) => {
    console.error("Failed to initialize NASA services:", error);
  });

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Halcyon Backend API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
