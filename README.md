# OurSource

## Description

`OurSource` is a **Discord bot** that helps you administrate your **Discord server** to create channels for specific projects.

## Installation

### Requirement

- `nodejs` : `v21.5.0` or higher
- `npm` : `10.2.4` or higher

### Environement variables

The following environment variables are required to run the bot :

| Name | Description | Type | Default value |
| ---- | ----------- | ---- | ------------- |
| `DISCORD_TOKEN` | The token of the Discord bot | `string` | `null` |
| `DISCORD_APPLICATION_ID` | The application ID of the Discord bot | `string` | `null` |
| `POSTGRES_ADDR` | The address of the `postgres` database | `string` | `null` |
| `POSTGRES_PORT` | The port of the `postgres` database, common port used is `5432` | `number` | `null` |
| `POSTGRES_USER` | The username of the `postgres` user | `string` | `null` |
| `POSTGRES_PASSWORD` | The password of the `postgres` user | `string` | `null` |
| `POSTGRES_DB` | The name of the `postgres` database | `string` | `null` |

### Docker

```bash
docker build -t oursource:dev .
```

### Docker-compose

```bash
docker-compose up -d
```
