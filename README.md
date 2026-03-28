# Blood Collection Booking System

This project includes:

- `index.html`, `style.css`, `script.js`: frontend for GitHub Pages
- `server.js`: Render-ready Express backend
- `data/bookings.json`: JSON storage fallback
- `server/models/Booking.js`: optional MongoDB model

## Frontend

The frontend booking form includes:

- Full Name
- Phone Number
- Email
- Test Type
- Date
- Time
- Address

It validates all fields, sends a `POST` request with `fetch`, shows a loading spinner, displays success or error feedback, and opens a WhatsApp fallback link if the API request fails.

## Backend

The backend exposes:

- `POST /book`
- `GET /health`
- `GET /api/health`

It uses:

- `cors()`
- `express.json()`
- JSON file storage by default
- MongoDB when `MONGODB_URI` is configured
- Twilio WhatsApp API or WhatsApp Cloud API when credentials are configured

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and add your credentials.

3. Start the backend:

```bash
npm start
```

## Render Deployment

1. Push the repository to GitHub.
2. Create a new Render Web Service from the repository.
3. Use:

```text
Build Command: npm install
Start Command: npm start
```

4. Add environment variables from `.env.example`.
5. If you want persistent storage on Render, set `MONGODB_URI` to MongoDB Atlas.
6. After deploy, note your live backend URL:

```text
https://your-service-name.onrender.com
```

7. Confirm the health endpoint:

```text
https://your-service-name.onrender.com/health
```

## GitHub Pages Deployment

1. In the frontend `index.html`, update:

```html
<script>
  window.BOOKING_API_URL = "https://your-backend.onrender.com/book";
</script>
```

2. Replace it with your real Render URL, for example:

```html
<script>
  window.BOOKING_API_URL = "https://your-service-name.onrender.com/book";
</script>
```

3. Push the frontend files to GitHub.
4. Enable GitHub Pages in the repository settings.

## WhatsApp Setup

### Option 1: Twilio

Set:

- `WHATSAPP_PROVIDER=twilio`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `TWILIO_WHATSAPP_TO`

### Option 2: WhatsApp Cloud API

Set:

- `WHATSAPP_PROVIDER=cloud`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_CLOUD_TOKEN`

If the WhatsApp provider is not configured, the booking still saves and the frontend can fall back to:

```text
https://wa.me/918454822399?text=...
```

## Notes

- JSON storage works immediately but is temporary on Render.
- MongoDB is the better choice for production persistence.
- The frontend does not use any `localhost` API URL.
