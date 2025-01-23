# Discord Bot with ExpressJS

This repository contains a **Discord bot** combined with **Express** routes and **Kysely** (for database interactions). The bot can post messages to Discord channels, fetch GIFs from Giphy, and store data in SQLite (or another DB). This README covers setup, usage, assumptions, and testing instructions.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Endpoints](#endpoints)
  - /messages 
  - /templates 
  - /sprint   
- [Discord Integration](#discord-integration)


---

## Prerequisites

- **Node.js** v16+ recommended
- **npm** or **Yarn**
- **Discord** channel if you plan to post bot messages
- **Giphy** account for a Giphy API key (if using GIF fetching)

---

## Installation

1. **Clone** the repository:
   ```bash
   git clone https://github.com/your-username/discord-bot.git
   cd discord-bot
   npm or yarn install
   ```

2. Copy the example file (.env.example)
   ```
    cp .env.example .env
   ```

## Environment Variables
 Fill in your real environment variables in .env:
   ```
   DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/123/xyz"
   GIPHY_API="YOUR_GIPHY_API_KEY"
   DATABASE_FILE="data/database.db"
```



## Running the App
```
 npm run dev
```

## Endpoints

### Messages Routes

•	GET /messages
Returns all messages.

•	GET /messages/username/:userName
Returns all congratulatory messages for a given userName.

•	GET /messages/sprint/:sprintCode
Returns messages related to a specific sprintCode.

•	POST /messages
Creates a new message, and posts to Discord (if configured).


### Templates Routes

•	GET /templates
Returns all templates.

•	GET /templates/:id
Returns a template by its ID.

•	POST /templates
Creates a new template (template field in JSON).

•	PATCH /templates/:id
Updates a template by ID.

•	DELETE /templates/delete/:id
Deletes a template by ID.


### Sprint Routes
•	GET /sprint
Returns all sprints.

•	GET /sprint/:id
Returns a sprint by its ID.

•	POST /sprint
Creates a new sprint.

•	PATCH /sprint/:id
Updates a sprint record by ID.

•	DELETE /sprint/delete/:id
Deletes a sprint record by ID.


## Discord Integration
•	```DISCORD_WEBHOOK_URL``` is used by the bot to send messages to a Discord channel.

•	Ensure the ```.env ```file contains a valid Discord webhook URL.

•	The app posts messages (like  “congrats” messages) to this webhook.
