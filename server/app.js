const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs/promises");
const https = require("https");
const dotenv = require("dotenv");
const { randomUUID } = require("crypto");
const Booking = require("./models/Booking");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const PORT = Number(process.env.PORT) || 5000;
const ROOT_DIR = path.join(__dirname, "..");
const ROOT_INDEX_FILE = path.join(ROOT_DIR, "index.html");
const CLIENT_DIR = path.join(ROOT_DIR, "client");
const CLIENT_INDEX_FILE = path.join(CLIENT_DIR, "index.html");
const DATA_DIRECTORY = path.join(ROOT_DIR, "data");
const DATA_FILE = path.join(DATA_DIRECTORY, "bookings.json");
const TEST_TYPES = ["Blood Test", "Sugar Test", "Full Body Checkup"];
const WHATSAPP_NUMBER = "8454822399";
const WHATSAPP_NUMBER_WITH_COUNTRY_CODE = `91${WHATSAPP_NUMBER}`;
const DEFAULT_COUNTRY_CODE = "91";
const DEFAULT_WHATSAPP_NOTIFY_TO = `+${WHATSAPP_NUMBER_WITH_COUNTRY_CODE}`;
const DEFAULT_TWILIO_WHATSAPP_TO = `whatsapp:${DEFAULT_WHATSAPP_NOTIFY_TO}`;
const WHATSAPP_PROVIDER = (process.env.WHATSAPP_PROVIDER || "").trim().toLowerCase();
const MONGODB_URI = (process.env.MONGODB_URI || "").trim();

let bookingStorage = {
  mode: "json",
  async save(bookingData) {
    return saveBookingToJson(bookingData);
  }
};

let databaseStatus = {
  connected: false,
  mode: "json",
  message: "Running with JSON file booking storage."
};

let jsonWriteQueue = Promise.resolve();

const normalizeBookingInput = (body = {}) => ({
  name: typeof body.name === "string" ? body.name.trim() : "",
  phone: typeof body.phone === "string" ? body.phone.trim() : "",
  email: typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
  packageName: typeof body.packageName === "string" ? body.packageName.trim() : "",
  testType: typeof body.testType === "string" ? body.testType.trim() : "",
  date: typeof body.date === "string" ? body.date.trim() : "",
  time: typeof body.time === "string" ? body.time.trim() : "",
  address: typeof body.address === "string" ? body.address.trim() : ""
});

const getTodayInIndia = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const values = parts.reduce((result, part) => {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }

    return result;
  }, {});

  return `${values.year}-${values.month}-${values.day}`;
};

const isValidDateString = (value = "") => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
};

const isValidTimeString = (value = "") => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

const validateBookingInput = (bookingData) => {
  const errors = [];
  const phoneDigits = bookingData.phone.replace(/\D/g, "");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (bookingData.name.length < 2) {
    errors.push("Full name is required.");
  }

  if (!bookingData.phone) {
    errors.push("Phone number is required.");
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.push("Phone number must be between 10 and 15 digits.");
  }

  if (!bookingData.email) {
    errors.push("Email is required.");
  } else if (!emailPattern.test(bookingData.email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!bookingData.packageName) {
    errors.push("Please select a health package.");
  }

  if (!TEST_TYPES.includes(bookingData.testType)) {
    errors.push("Please select a valid test type.");
  }

  if (!bookingData.date) {
    errors.push("Preferred date is required.");
  } else if (!isValidDateString(bookingData.date)) {
    errors.push("Please provide a valid date.");
  } else if (bookingData.date < getTodayInIndia()) {
    errors.push("Preferred date cannot be in the past.");
  }

  if (!bookingData.time) {
    errors.push("Preferred time is required.");
  } else if (!isValidTimeString(bookingData.time)) {
    errors.push("Please provide a valid time.");
  }

  if (!bookingData.address) {
    errors.push("Address is required.");
  } else if (bookingData.address.length < 10) {
    errors.push("Please enter a complete home visit address.");
  }

  return errors;
};

const buildWhatsAppMessage = (bookingData) =>
  [
    "New Booking:",
    `Name: ${bookingData.name}`,
    `Phone: ${bookingData.phone}`,
    `Email: ${bookingData.email}`,
    `Package: ${bookingData.packageName}`,
    `Test: ${bookingData.testType}`,
    `Date: ${bookingData.date}`,
    `Time: ${bookingData.time}`,
    `Address: ${bookingData.address}`
  ].join("\n");

const getTrimmedEnvValue = (name) => (process.env[name] || "").trim();

const getMissingEnvKeys = (keys = []) => keys.filter((key) => !getTrimmedEnvValue(key));

const normalizePhoneDigits = (value = "") => String(value).replace(/\D/g, "");

const formatE164PhoneNumber = (value = "", fallbackCountryCode = DEFAULT_COUNTRY_CODE) => {
  const trimmedValue = String(value).trim();

  if (!trimmedValue) {
    return "";
  }

  const withoutWhatsAppPrefix = trimmedValue.replace(/^whatsapp:/i, "");
  const digits = normalizePhoneDigits(withoutWhatsAppPrefix);

  if (!digits) {
    return "";
  }

  if (withoutWhatsAppPrefix.startsWith("+")) {
    return `+${digits}`;
  }

  if (digits.startsWith(fallbackCountryCode)) {
    return `+${digits}`;
  }

  return `+${fallbackCountryCode}${digits}`;
};

const formatTwilioWhatsAppNumber = (value = "") => {
  const e164Number = formatE164PhoneNumber(value);
  return e164Number ? `whatsapp:${e164Number}` : "";
};

const formatCloudWhatsAppNumber = (value = "") => {
  const e164Number = formatE164PhoneNumber(value);
  return e164Number ? e164Number.replace(/^\+/, "") : "";
};

const getNormalizedWhatsAppProvider = () => {
  if (WHATSAPP_PROVIDER === "meta") {
    return "cloud";
  }

  if (WHATSAPP_PROVIDER === "twilio" || WHATSAPP_PROVIDER === "cloud") {
    return WHATSAPP_PROVIDER;
  }

  return "none";
};

const getTwilioWhatsAppConfig = () => {
  const missingEnv = getMissingEnvKeys([
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_WHATSAPP_FROM"
  ]);
  const accountSid = getTrimmedEnvValue("TWILIO_ACCOUNT_SID");
  const authToken = getTrimmedEnvValue("TWILIO_AUTH_TOKEN");
  const fromNumber = formatTwilioWhatsAppNumber(getTrimmedEnvValue("TWILIO_WHATSAPP_FROM"));
  const target =
    formatTwilioWhatsAppNumber(
      getTrimmedEnvValue("TWILIO_WHATSAPP_TO") ||
        getTrimmedEnvValue("WHATSAPP_NOTIFY_TO") ||
        DEFAULT_WHATSAPP_NOTIFY_TO
    ) || DEFAULT_TWILIO_WHATSAPP_TO;
  const enabled = missingEnv.length === 0 && Boolean(fromNumber);

  return {
    enabled,
    provider: "twilio",
    target,
    fromNumber: fromNumber || null,
    missingEnv,
    message: enabled
      ? `Twilio WhatsApp is configured to send booking details to ${target}.`
      : `Twilio WhatsApp is not ready. Missing env vars: ${missingEnv.join(", ")}.`
  };
};

const getWhatsAppCloudConfig = () => {
  const missingEnv = getMissingEnvKeys(["WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_CLOUD_TOKEN"]);
  const phoneNumberId = getTrimmedEnvValue("WHATSAPP_PHONE_NUMBER_ID");
  const accessToken = getTrimmedEnvValue("WHATSAPP_CLOUD_TOKEN");
  const apiVersion = getTrimmedEnvValue("WHATSAPP_CLOUD_VERSION") || "v23.0";
  const target =
    formatCloudWhatsAppNumber(
      getTrimmedEnvValue("WHATSAPP_CLOUD_TO") ||
        getTrimmedEnvValue("WHATSAPP_NOTIFY_TO") ||
        DEFAULT_WHATSAPP_NOTIFY_TO
    ) || WHATSAPP_NUMBER_WITH_COUNTRY_CODE;
  const enabled = missingEnv.length === 0;

  return {
    enabled,
    provider: "whatsapp-cloud",
    phoneNumberId,
    accessToken,
    apiVersion,
    target: target ? `+${target}` : null,
    missingEnv,
    message: enabled
      ? `WhatsApp Cloud API is configured to send booking details to +${target}.`
      : `WhatsApp Cloud API is not ready. Missing env vars: ${missingEnv.join(", ")}.`
  };
};

const getWhatsAppConfiguration = () => {
  const normalizedProvider = getNormalizedWhatsAppProvider();

  if (normalizedProvider === "twilio") {
    return getTwilioWhatsAppConfig();
  }

  if (normalizedProvider === "cloud") {
    return getWhatsAppCloudConfig();
  }

  return {
    enabled: false,
    provider: "none",
    target: null,
    missingEnv: WHATSAPP_PROVIDER ? [] : ["WHATSAPP_PROVIDER"],
    message: WHATSAPP_PROVIDER
      ? `Unsupported WHATSAPP_PROVIDER "${WHATSAPP_PROVIDER}". Use twilio or cloud.`
      : "Set WHATSAPP_PROVIDER to twilio or cloud to enable automatic WhatsApp delivery."
  };
};

const toPublicWhatsAppConfiguration = (config) => ({
  provider: config.provider,
  configured: config.enabled,
  target: config.target,
  missingEnv: config.missingEnv,
  message: config.message,
  ...(config.fromNumber ? { fromNumber: config.fromNumber } : {})
});

const buildNotificationResult = ({ status, config, message, error }) => ({
  status,
  ...toPublicWhatsAppConfiguration(config),
  message: message || config.message,
  ...(error ? { error } : {})
});

const ensureJsonStorage = async () => {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.writeFile(DATA_FILE, "[]\n", "utf8");
  }
};

const readJsonBookings = async () => {
  await ensureJsonStorage();
  const fileContents = await fs.readFile(DATA_FILE, "utf8");
  const parsedBookings = JSON.parse(fileContents || "[]");

  return Array.isArray(parsedBookings) ? parsedBookings : [];
};

const saveBookingToJson = async (bookingData) => {
  const persistBooking = async () => {
    const bookings = await readJsonBookings();
    const savedBooking = {
      id: randomUUID(),
      ...bookingData,
      createdAt: new Date().toISOString()
    };

    bookings.push(savedBooking);
    await fs.writeFile(DATA_FILE, `${JSON.stringify(bookings, null, 2)}\n`, "utf8");

    return savedBooking;
  };

  const queuedWrite = jsonWriteQueue.then(persistBooking, persistBooking);
  jsonWriteQueue = queuedWrite.catch(() => {});
  return queuedWrite;
};

const sendHttpsRequest = (url, { method = "POST", headers = {}, body = "" } = {}) =>
  new Promise((resolve, reject) => {
    const request = https.request(url, { method, headers }, (response) => {
      let responseBody = "";

      response.on("data", (chunk) => {
        responseBody += chunk;
      });

      response.on("end", () => {
        let responseJson = null;

        if (responseBody) {
          try {
            responseJson = JSON.parse(responseBody);
          } catch (error) {
            responseJson = null;
          }
        }

        resolve({
          statusCode: response.statusCode || 500,
          body: responseBody,
          json: responseJson
        });
      });
    });

    request.on("error", reject);

    if (body) {
      request.write(body);
    }

    request.end();
  });

const sendViaTwilio = async (message) => {
  const twilioConfig = getTwilioWhatsAppConfig();
  const accountSid = getTrimmedEnvValue("TWILIO_ACCOUNT_SID");
  const authToken = getTrimmedEnvValue("TWILIO_AUTH_TOKEN");

  if (!twilioConfig.enabled) {
    return buildNotificationResult({
      status: "skipped",
      config: twilioConfig
    });
  }

  const body = new URLSearchParams({
    To: twilioConfig.target,
    From: twilioConfig.fromNumber,
    Body: message
  }).toString();

  const response = await sendHttpsRequest(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body)
      },
      body
    }
  );

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return buildNotificationResult({
      status: "sent",
      config: twilioConfig,
      message: `WhatsApp notification sent successfully to ${twilioConfig.target}.`
    });
  }

  throw new Error(
    response.json?.message || "Twilio WhatsApp API returned an unexpected error."
  );
};

const sendViaWhatsAppCloud = async (message) => {
  const cloudConfig = getWhatsAppCloudConfig();

  if (!cloudConfig.enabled) {
    return buildNotificationResult({
      status: "skipped",
      config: cloudConfig
    });
  }

  const payload = JSON.stringify({
    messaging_product: "whatsapp",
    to: normalizePhoneDigits(cloudConfig.target),
    type: "text",
    text: {
      preview_url: false,
      body: message
    }
  });

  const response = await sendHttpsRequest(
    `https://graph.facebook.com/${cloudConfig.apiVersion}/${cloudConfig.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cloudConfig.accessToken}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      },
      body: payload
    }
  );

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return buildNotificationResult({
      status: "sent",
      config: cloudConfig,
      message: `WhatsApp notification sent successfully to ${cloudConfig.target}.`
    });
  }

  throw new Error(
    response.json?.error?.message || "WhatsApp Cloud API returned an unexpected error."
  );
};

const sendWhatsAppNotification = async (message) => {
  const whatsappConfig = getWhatsAppConfiguration();

  try {
    if (getNormalizedWhatsAppProvider() === "twilio") {
      return await sendViaTwilio(message);
    }

    if (getNormalizedWhatsAppProvider() === "cloud") {
      return await sendViaWhatsAppCloud(message);
    }

    return buildNotificationResult({
      status: "skipped",
      config: whatsappConfig
    });
  } catch (error) {
    return buildNotificationResult({
      status: "failed",
      config: whatsappConfig,
      message: error.message || "Unable to send WhatsApp notification.",
      error: error.message || "Unable to send WhatsApp notification."
    });
  }
};

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(ROOT_DIR, { index: false }));

  app.get(["/health", "/api/health"], (req, res) => {
    const whatsappConfig = getWhatsAppConfiguration();

    res.status(200).json({
      success: true,
      message: "Server is running",
      database: databaseStatus,
      whatsappProvider: whatsappConfig.provider === "none" ? "not-configured" : whatsappConfig.provider,
      whatsapp: toPublicWhatsAppConfiguration(whatsappConfig)
    });
  });

  const handleBookingRequest = async (req, res) => {
    const bookingData = normalizeBookingInput(req.body);
    const validationErrors = validateBookingInput(bookingData);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors[0],
        errors: validationErrors
      });
    }

    try {
      const savedBooking = await bookingStorage.save(bookingData);
      const notification = await sendWhatsAppNotification(
        buildWhatsAppMessage(bookingData)
      );

      return res.status(201).json({
        success: true,
        message: "Booking saved successfully.",
        booking: savedBooking,
        notification
      });
    } catch (error) {
      console.error("Failed to save booking:", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong while saving the booking."
      });
    }
  };

  app.post("/book", handleBookingRequest);
  app.post("/api/bookings", handleBookingRequest);

  app.use("/api", (req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found."
    });
  });

  app.get("/", (req, res) => {
    res.sendFile(ROOT_INDEX_FILE);
  });

  app.get("/app", (req, res) => {
    res.sendFile(CLIENT_INDEX_FILE);
  });

  app.get("*", (req, res) => {
    res.sendFile(CLIENT_INDEX_FILE);
  });

  return app;
};

const connectToDatabase = async () => {
  await ensureJsonStorage();

  if (!MONGODB_URI) {
    bookingStorage = {
      mode: "json",
      async save(bookingData) {
        return saveBookingToJson(bookingData);
      }
    };

    databaseStatus = {
      connected: false,
      mode: "json",
      message: "MongoDB not configured. Using JSON file booking storage."
    };

    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });

    bookingStorage = {
      mode: "mongodb",
      async save(bookingData) {
        return Booking.create(bookingData);
      }
    };

    databaseStatus = {
      connected: true,
      mode: "mongodb",
      message: "MongoDB connected successfully."
    };

    console.log("MongoDB connected successfully.");
  } catch (error) {
    bookingStorage = {
      mode: "json",
      async save(bookingData) {
        return saveBookingToJson(bookingData);
      }
    };

    databaseStatus = {
      connected: false,
      mode: "json",
      message: "MongoDB unavailable. Using JSON file booking storage."
    };

    console.warn("MongoDB unavailable. Falling back to JSON file booking storage.");
    console.warn(error.message);
  }
};

const startServer = async () => {
  const app = createApp();

  await connectToDatabase();

  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Booking endpoint ready at /book`);
      console.log(`Storage mode: ${databaseStatus.mode}`);
      resolve({ app, server });
    });

    server.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports = {
  PORT,
  createApp,
  startServer
};
