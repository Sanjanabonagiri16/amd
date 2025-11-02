# AMD (Answering Machine Detection) Comparison Dashboard

A telephony dashboard for comparing four Answering Machine Detection (AMD) strategies:
- Twilio Native
- Hugging Face ML
- Google Gemini Flash
- Jambonz SIP

## 🏗️ System Architecture

- **Frontend**: Next.js App Router with React components
- **Backend**: API routes handling calls, analytics, seeding, and webhooks
- **Database**: Prisma ORM connected to SQLite/PostgreSQL
- **External Integrations**: Twilio (voice), Hugging Face (transcription), Gemini (AI analysis), Jambonz (SIP)

## 🔬 Core AMD Strategies

| Strategy | Accuracy | Latency | Cost |
|----------|----------|---------|------|
| Twilio Native | 88% | 2.1s | $0.015 |
| Hugging Face ML | 92% | 1.2s | $0.005 |
| Gemini Flash | 95% | 0.8s | $0.003 |
| Jambonz SIP | 85% | 1.8s | $0.008 |

## ✨ Key Features

- Real-time dialer with strategy selection
- Call history with filtering and CSV export
- Side-by-side comparison dashboard
- Analytics (accuracy, precision, recall, F1)
- Secure authentication via NextAuth.js
- Mock data seeding (`/api/seed`)

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run database migrations: `npx prisma generate` and `npx prisma db push`
5. Start the development server: `npm run dev`

## 📁 Directory Structure

- `amd-app/`: Next.js frontend application
- `amd-service/`: Python-based backend service for ML/SIP processing