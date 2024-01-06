# OurSource

## Description

`OurSource` is a **Discord bot** that helps you administrate your **Discord server** to create channels for specific projects.

## Installation

### Requirement

- `nodejs` : `v21.5.0` or higher
- `npm` : `10.2.4` or higher

### Environement variables

The following environement variables are required to run the bot :
- `DISCORD_TOKEN` : The token of the Discord bot
- `DISCORD_APPLICATION_ID` : The application ID of the Discord bot
- `POSTGRES_PASSWORD` : The password of the `postgres` user for running with `docker compose`
- `POSTGRES_USER` : The username of the `postgres` user for running with `docker compose`
- `POSTGRES_DB` : The name of the `postgres` database for running with `docker compose`

### Docker

```bash
docker build -t oursource:dev .
```

### Docker-compose

```bash
docker-compose up -d
```
