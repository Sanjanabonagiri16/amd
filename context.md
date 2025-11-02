Assignment 1: Advanced Answering Machine Detection (AMD) Telephony System
Goal:
Build a secure, full-stack web app that:

Lets users dial outbound calls using Twilio.

Detects live if the receiver is a human or a machine/voicemail via multiple AMD strategies (Twilio native, Jambonz, Hugging Face ML, Google Gemini Flash).

Logs results to Postgres DB.

Provides a dashboard UI for call controls, AMD selection, status info, and comparison tables.

Features to Implement
Authentication: Role-based login/signup (Better Auth recommended).

Dialer UI: Phone number input, AMD strategy dropdown, call button, real-time call status indicator.

AMD Integration: Implement AMD with Twilio, Jambonz SIP, Hugging Face ML, and Google Gemini Flash.

Make AMD strategy selectable from the frontend UI.

Add streaming audio pipeline for AI/ML AMD detection.

Return result (human/machine) in under ~3 seconds.

Result Handling:

If human: connect call/session.

If machine/voicemail: hang up/log event.

Call History: Table (date, number, AMD used, result, audio file if possible, errors), filter, search, CSV export.

AMD Comparison: Table in UI/README summarizing accuracy, latency, and cost per AMD strategy.

Database: Store all call logs, errors, optional audio clips.

Testing: Use your phone for human cases; toll-free test numbers (e.g., Nike, PayPal) for machine detection.

Documentation: JSDoc/TypeDoc, ESLint, architecture diagram (Mermaid), setup scripts.

Security: Zod validation, HTTPS/tunnel for APIs, secrets handling.

Tools/Keys Needed
Twilio API key (free trial).

Hugging Face API/token (free; model: wav2vec, etc.).

Google Gemini API key (free dev tier).

Jambonz (cloud trial or Docker self-host).

Prompt for AI Code Assistant
Paste this as your system/user prompt for ChatGPT/Gemini/Copilot/etc:

