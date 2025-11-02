# 🔑 API Keys Setup Guide

## ✅ Integrations Implemented

All AMD strategy integrations are now **fully implemented** and ready to use once you add your API keys!

---

## 📋 Required API Keys

### 1. **Twilio** (Required for basic calling)

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+1234567890
```

**Get your keys:**
1. Sign up at https://www.twilio.com/console
2. Copy Account SID and Auth Token from dashboard
3. Buy a phone number: Console → Phone Numbers → Buy a Number

**Status:** ✅ Already integrated, just add keys

---

### 2. **Hugging Face** (Optional - ML-based AMD)

```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Get your key:**
1. Sign up at https://huggingface.co
2. Go to Settings → Access Tokens
3. Click "New token"
4. Select "Read" permissions
5. Copy the token (starts with `hf_`)

**Status:** ✅ Fully implemented
- Endpoint: `/api/huggingface/predict`
- Uses wav2vec2 model for speech recognition
- Detects voicemail patterns in transcription
- Falls back to mock if key not provided

---

### 3. **Google Gemini** (Optional - AI-powered AMD)

```env
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Get your key:**
1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIzaSy`)
4. Enable Gemini API in Google Cloud Console (if prompted)

**Status:** ✅ Fully implemented
- Endpoint: `/api/gemini/analyze`
- Uses Gemini 1.5 Flash for audio analysis
- AI-powered reasoning for human/machine detection
- Falls back to mock if key not provided

---

### 4. **Jambonz** (Optional - SIP-based AMD)

```env
JAMBONZ_ACCOUNT_SID=your_account_sid
JAMBONZ_API_KEY=your_api_key
JAMBONZ_REST_API_URL=https://your-instance.jambonz.cloud
JAMBONZ_FROM_NUMBER=+1234567890
```

**Get your credentials:**

**Option A: Jambonz Cloud (Easiest)**
1. Sign up at https://jambonz.cloud
2. Go to Account → API Keys
3. Copy Account SID and API Key
4. Your REST API URL will be provided

**Option B: Self-Hosted (Free)**
1. Follow setup: https://github.com/jambonz/jambonz-feature-server
2. Deploy to your server
3. Configure SIP trunk
4. Generate API credentials

**Status:** ✅ Fully implemented
- Endpoints: `/api/jambonz/call`, `/api/jambonz/amd`, `/api/jambonz/webhook`
- Native SIP-based AMD detection
- Falls back to mock if credentials not provided

---

## 🚀 Quick Setup

### Step 1: Copy Environment File

```bash
cd amd-app
cp .env.example .env
```

### Step 2: Add Your API Keys

Edit `.env` and add the keys you have:

```env
# Required (for basic functionality)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_FROM_NUMBER=+1234567890

# Optional (add any you want to use)
HUGGINGFACE_API_KEY=hf_xxxxx
GOOGLE_API_KEY=AIzaSyxxxxx
JAMBONZ_ACCOUNT_SID=xxxxx
JAMBONZ_API_KEY=xxxxx
```

### Step 3: Test the Integrations

```bash
npm run dev
```

Visit http://localhost:3000/dialer and try each strategy!

---

## 🧪 Testing Each Integration

### Test Twilio (Native AMD)
1. Select "Twilio Native AMD" strategy
2. Enter a phone number
3. Click "Dial"
4. Result will show in ~2-3 seconds

### Test Hugging Face
1. Select "Hugging Face ML" strategy
2. Make a call
3. Audio will be transcribed and analyzed
4. Voicemail patterns detected automatically

### Test Gemini
1. Select "Gemini Flash" strategy
2. Make a call
3. AI analyzes audio with reasoning
4. Most accurate detection

### Test Jambonz
1. Select "Jambonz SIP AMD" strategy
2. Make a call
3. SIP-based detection
4. Open-source alternative

---

## 💰 Cost Estimates

| Service | Free Tier | Paid Pricing |
|---------|-----------|--------------|
| **Twilio** | $15 trial credit | ~$0.013/min |
| **Hugging Face** | 30K chars/month | ~$0.60/hour inference |
| **Google Gemini** | 60 req/min | ~$0.00025/1K chars |
| **Jambonz** | Self-hosted free | Cloud ~$0.004/min |

**Recommendation:** Start with Twilio (easiest), add Gemini for best accuracy, use Jambonz for cost savings at scale.

---

## ✅ What Works Without API Keys

Even without API keys, you can:
- ✅ View the full UI
- ✅ See mock call data
- ✅ Test navigation and features
- ✅ Export mock data
- ⚠️ Strategies will return mock results

---

## 🔧 Troubleshooting

### "API key not configured" message
- Check `.env` file exists in `amd-app/` folder
- Verify key format (no quotes, no spaces)
- Restart dev server after adding keys

### Hugging Face "Model loading" error
- Model needs ~20 seconds to load first time
- Wait and try again
- Or use a different model endpoint

### Gemini "Invalid API key" error
- Verify key starts with `AIzaSy`
- Enable Gemini API in Google Cloud Console
- Check billing is enabled (free tier available)

### Jambonz connection errors
- Verify REST API URL is correct
- Check SIP trunk is configured
- Ensure webhooks can reach your server (use ngrok for local dev)

---

## 📞 Support

If you need help:
1. Check the console logs for detailed errors
2. Verify API keys are correct
3. Test with Twilio first (simplest integration)
4. Each integration has fallback to mock data

---

## 🎯 Next Steps

Once you add your API keys:

1. **Test all strategies** - Compare accuracy
2. **Review comparison page** - See metrics
3. **Check call history** - View results
4. **Export data** - Analyze performance
5. **Choose best strategy** - Based on your needs

---

**All integrations are ready! Just add your API keys and start testing! 🚀**
