# Stockly — AI Investment Research Desk

Stockly is an equity research dashboard that compiles market snapshots, historical prices, recent company news, and an AI-written research memo. Its separate **INVEST** or **PASS** market signal is calculated from historical price momentum using a visible scoring rule.

* **Live Frontend App**: [https://vrstockly.vercel.app/](https://vrstockly.vercel.app/)
* **Live Backend Server**: [https://insideiim-assigment-k26l.onrender.com](https://insideiim-assigment-k26l.onrender.com)

---

## 🚀 Overview — What it Does

Stockly brings company lookup, market data, news, and a structured research memo into one responsive research desk:
1. **Interactive Chat Input**: Accepts any company name or ticker query from the user.
2. **Ticker Resolution & Validation**: Searches Yahoo Finance equity listings, preferring NSE/BSE symbols for Indian companies, and checks chart data where available. An unresolved result is shown as unverified instead of being assumed unlisted.
3. **Market Metrics Snapshot**: Fetches current prices, previous closes, 52-week ranges, volume, and returns dynamically in the correct exchange currency (INR `₹` or USD `$`).
4. **Historical Price Charting**: Queries parallel timelines of Yahoo Finance data to render interactive, Groww-style price charts.
5. **Real-time Catalyst Crawl**: Crawls Google News feeds to parse current headlines and sentiments.
6. **Research Memo and Market Signal**: Generates a structured memo with a summary, financial health, market position, three risks, and conclusion. A separate price-momentum score drives the `INVEST` or `PASS` signal. The memo view formats headings, metadata, lists, and price paths for readability.
7. **Session Logs**: Saves authenticated logs to MongoDB, offering hoverable logs deletion and history tracking in the sidebar.

---

## 🛠️ How to Run It — Setup & Run Steps

### 1. Prerequisites
Ensure you have the following installed locally:
* [Node.js](https://nodejs.org/) (v20+ recommended for the current Vite toolchain)
* [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or via MongoDB Atlas URI)

### 2. Environment Configuration
Create a `.env` file inside the `backend/` directory with the following variables:

```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/insideiim
JWT_SECRET="your_jwt_signing_secret"

# LLM API Keys (At least one must be set. Key fallback chain is configured automatically)
GEMINI_API_KEY="your_google_gemini_api_key"
OPENAI_API_KEY="your_openai_api_key_optional"
HUGGING_FACE_API_KEY="your_huggingface_api_key_optional"
```

### 3. Running the Backend Server
Navigate to the `backend/` folder, install dependencies, and start the node server:
```bash
cd backend
npm install
npm run dev   # Runs nodemon server on port 5000
```

### 4. Running the Frontend client
Navigate to the `frontend/` folder, install dependencies, and launch the Vite development server:
```bash
cd ../frontend
npm install
npm run dev   # Launches client on http://localhost:5173
```

---

### Frontend TypeScript and routes

The frontend uses React with TypeScript (`.tsx` and `.ts` files), strict TypeScript checking, and Vite. Public pages are `/`, `/features`, and `/how-it-works`; the research desk is `/dashboard`, with `/login` and `/register` for authentication. The existing chart, report history, search, and deletion flows remain available from the dashboard. The layout adapts to mobile screens and uses a mobile navigation menu.

For local development, Vite proxies `/api` requests to `http://localhost:5000` to avoid browser CORS errors. Set `VITE_DEV_API_TARGET` in `frontend/.env.local` when the backend runs at another address.

The root `vercel.json` installs and builds the Vite app from `frontend/` and publishes `frontend/dist`, so the Vercel project can use the repository root as its Root Directory. It also rewrites client-side routes to the SPA entry point.

## 🧠 How it Works — Approach & Architecture

Stockly implements an autonomous **LangGraph StateGraph** pipeline on the backend to execute the research steps sequentially:

* **`findTickerNode`**: Handles the `LTM` -> `LT.NS` alias and searches Yahoo Finance for equity symbols. The LLM resolver is a fallback when the search endpoint has no equity result.
* **`fetchFinancialsNode`**: Requests market metrics metadata and exchange configurations directly from Yahoo Finance.
* **`fetchPriceHistoryNode`**: Pulls historical pricing ranges in parallel for multiple timeframes (`1D`, `1W`, `1M`, `3M`, `6M`, `1Y`, `5Y`).
* **`fetchNewsNode`**: Crawls Google News feeds to parse headlines.
* **`analyzeNode`**: Generates a memo with a validated structure. Incomplete model output gets one repair attempt; the recommendation is calculated separately from the model-written memo.
* **Market signal calculation**: Scores the 1M, 3M, 6M, 1Y, 3Y, and 5Y price returns. Returns are normalized around 50 using full-scale moves of 8%, 18%, 30%, 50%, 70%, and 150%, then weighted (15%, 18%, 20%, 20%, 15%, and 12%). Periods with inadequate price-history coverage are excluded and remaining weights are renormalized. At least two sufficiently complete periods are required; a score of 60 or higher produces `INVEST`, otherwise `PASS`. The signal describes historical price momentum; it does not assess valuation, company fundamentals, or future performance.

---

## ⚖️ Key Decisions & Trade-Offs

### What We Chose and Why:
* **LLM Fallback Wrapper (`FallbackChatModel`)**: Google's free tier of Gemini has strict daily quota limits (which return `429 Too Many Requests` errors). We built a custom fallback class. If Gemini blocks a request, the agent transparently falls back to OpenAI or a serverless Hugging Face provider (`Qwen/Qwen2.5-72B-Instruct`) to prevent service interruptions.
* **Finance-focused interface**: Uses a restrained green and deep-teal palette, clear data cards, responsive navigation, charts, and structured memo sections to make financial information easier to scan.
* **Dynamic Exchange Currencies**: Instead of hardcoding `₹` or `$`, the app parses metadata from Yahoo Finance and formats prices, ranges, and returns in the native trading currency of the stock exchange.
* **Listing verification**: Yahoo Finance equity search resolves company names to symbols, then chart metadata and price history verify the result. When those checks cannot confirm a listing, Stockly labels it `LISTING UNVERIFIED`; it does not infer private/unlisted status from a missing ticker alone.

### What We Left Out (Trade-offs):
* **Real-time WebSocket Streaming**: We chose to fetch the entire graph state via REST. While WebSockets allow live node-by-node updates, REST endpoints kept database synchronization simple, reliable, and easily protected behind JWT middleware.

---

## 📊 Report behavior

- A recognized Yahoo Finance equity is shown with its resolved ticker. If lookup or chart data cannot verify the listing, the report uses `LISTING UNVERIFIED` rather than inferring that the company is private or unlisted.
- `INVEST` and `PASS` are generated from the documented price-momentum score, not selected by the memo-writing model. `PASS` can result when only one complete historical period is available.
- Historical price momentum is not a guarantee of future performance or a full investment recommendation. Review the memo, market data, and risks before making investment decisions.

### Frontend checks

From `frontend/`, run `npx tsc --noEmit` for TypeScript checking and `npm run build` for a production build.

---

## 🔮 Future Scope

In future versions, the platform will expand to include:
1. **Google OAuth Registration**: Integrated single-sign-on (SSO) to allow users to sign up and authenticate using Google Accounts.
2. **API Rate Limiting**: Advanced dynamic rate limiting using IP address mapping and JWT token limits to control high-volume agent usage.
3. **Subscription-Based Accounts**: Subscription tier integration to offer premium analytical features (unlimited reports, real-time alerts) for paid tiers.
4. **User Profile Settings**: Settings panel allowing users to edit profile information (names, emails) and perform GDPR-compliant account deletions directly from the dashboard.
