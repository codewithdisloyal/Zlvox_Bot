# ZLVOX Telegram Bot

A production-ready Telegram bot built with Node.js and Telegraf.

## Prerequisites

- Node.js (Latest LTS recommended)
- Telegram Bot Token (obtain from [@BotFather](https://t.me/BotFather))

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy the example environment file and add your bot token.
   ```bash
   cp .env.example .env
   ```

3. Run the application:
   - **Development mode** (auto-restarts on changes):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```

## Folder Structure

- `src/` - Main source code directory
  - `config/` - Configuration files (environment variables, constants)
  - `services/` - Business logic, external API integrations, and AI features
  - `index.js` - Application entry point

## Future Scope
This bot is structured cleanly to allow easy integration of AI features or complex services in the `services/` folder.
