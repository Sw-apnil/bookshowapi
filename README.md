# 🎬 QuickShow - Backend Server

Backend API server for QuickShow movie ticket booking platform. Built with Node.js, Express, and MongoDB.

## ✨ Features

- 🎥 Movie & Show Management with TMDB integration
- 🎫 Real-time seat booking system
- 💳 Stripe payment processing
- 🔐 Clerk authentication with role-based access
- ⚡ Background jobs with Inngest (emails, reminders, auto-cleanup)
- 📧 Email notifications via Resend

## 🛠️ Tech Stack

- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose**
- **Clerk** - Authentication
- **Stripe** - Payments
- **Inngest** - Background jobs
- **Resend** - Email service
- **TMDB API** - Movie data

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup

Create `.env` file:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickshow

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Inngest
INNGEST_EVENT_KEY=your_key
INNGEST_SIGNING_KEY=your_signing_key

# TMDB API
TMDB_API_KEY=your_tmdb_bearer_token

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email
RESEND_API_KEY=re_xxxxx
SENDER_EMAIL=onboarding@resend.dev
```

### 3. Run Server

**Development:**
```bash
npm run server
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:3000`

## 📁 Project Structure

```
server/
├── configs/           # Database & email config
├── controllers/       # Business logic
├── inngest/          # Background jobs
├── middleware/       # Auth middleware
├── models/           # Mongoose schemas
├── routes/           # API endpoints
└── server.js         # Entry point
```

## 🗄️ Database Models

**User** - Clerk ID, name, email, image  
**Movie** - TMDB data (title, overview, poster, etc.)  
**Show** - Movie reference, datetime, price, occupied seats  
**Booking** - User, show, amount, seats, payment status

## 🔌 API Endpoints

### Public
- `GET /api/show/all` - All shows
- `GET /api/show/:movieId` - Shows for a movie
- `POST /api/booking/create` - Create booking
- `GET /api/booking/seats/:showId` - Occupied seats

### User (Auth Required)
- `GET /api/user/bookings` - User's bookings
- `POST /api/user/update-favorite` - Add/remove favorite
- `GET /api/user/favorites` - Get favorites

### Admin (Admin Role Required)
- `GET /api/admin/is-admin` - Check admin status
- `GET /api/admin/dashboard` - Analytics data
- `GET /api/admin/all-shows` - All shows
- `GET /api/admin/all-bookings` - All bookings
- `GET /api/show/now-playing` - Fetch TMDB movies
- `POST /api/show/add` - Create new show

### Webhooks
- `POST /api/stripe` - Stripe webhooks
- `POST /api/inngest` - Inngest events

## ⚡ Background Jobs (Inngest)

| Job | Trigger | Action |
|-----|---------|--------|
| User Sync | Clerk webhooks | Create/update/delete users |
| Auto Cleanup | 10 min after booking | Release unpaid seats |
| Booking Email | Payment success | Send confirmation |
| Show Reminders | Every 8 hours | Email users before shows |
| New Show Alert | Show added | Notify all users |

## 🔐 Authentication

- **Clerk middleware** validates all requests
- **Admin middleware** checks `user.privateMetadata.role === "admin"`
- Set admin role in Clerk Dashboard → User → Metadata

## 💳 Payment Flow

1. Client creates booking → Returns Stripe checkout URL
2. User pays on Stripe → Webhook updates `isPaid = true`
3. Inngest sends confirmation email
4. If unpaid after 10 min → Auto-release seats

## 🚀 Deployment

### Vercel
```bash
vercel --prod
```

Configure webhooks after deployment:
- Clerk: `https://your-domain.com/api/inngest`
- Stripe: `https://your-domain.com/api/stripe`

### Environment Variables
Set all `.env` variables in your hosting platform's dashboard.

## 🐛 Troubleshooting

**MongoDB Connection Error**  
→ Check `MONGODB_URI` and IP whitelist

**Clerk Auth Failed**  
→ Verify publishable and secret keys match

**Stripe Webhook Failed**  
→ Check webhook secret matches Stripe dashboard

**Emails Not Sending**  
→ Verify Resend API key and sender email

## 📚 Key Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `@clerk/express` - Auth
- `stripe` - Payments
- `inngest` - Background jobs
- `resend` - Emails
- `axios` - TMDB API calls

## 🔗 Documentation

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Clerk](https://clerk.com/docs)
- [Stripe](https://stripe.com/docs)
- [Inngest](https://www.inngest.com/docs)
- [TMDB API](https://developer.themoviedb.org/docs)

---

💡 **Tip:** Test Stripe webhooks locally using Stripe CLI before production deployment!
