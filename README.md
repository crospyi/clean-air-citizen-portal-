# Clean Air Citizen Portal

A modern React web application for citizen engagement, air quality reporting, and community discussions. It empowers citizens to track local environmental conditions, report hazards, log daily eco-friendly activities, and participate in localized discussion forums.

## Features

- **Air Quality reporting**: Submit reports about local pollution hazards, classify them by category and severity, and upvote/downvote reports.
- **Eco Check-ins**: Log daily green attendance and build eco-friendly habits.
- **State & City Communities**: Localized chatrooms for discussions, announcements, and sharing initiatives.
- **AI Integration**: Powered by Gemini for smart assessments and suggestions.

## Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)

### Setup & Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory (based on [.env.example](.env.example)) and configure your API keys:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

4. **Build for Production**:
   ```bash
   npm run build
   ```
