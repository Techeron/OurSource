-- Create Guild table if not exists
CREATE TABLE IF NOT EXISTS Guild (
  id SERIAL PRIMARY KEY,
  roleChannel INT
);

-- Create Channel table if not exists
CREATE TABLE IF NOT EXISTS Channel (
  id SERIAL PRIMARY KEY
);

-- Create Project table if not exists
CREATE TABLE IF NOT EXISTS Project (
  id SERIAL PRIMARY KEY,
  guildId INT REFERENCES Guild(id),
  channelId INT REFERENCES Channel(id)
);

-- Create Role table if not exists
CREATE TABLE IF NOT EXISTS Role (
  id SERIAL PRIMARY KEY,
  projectId INT REFERENCES Project(id),
  isDev BOOLEAN
);

-- Create Webhook table if not exists
CREATE TABLE IF NOT EXISTS Webhook (
  id SERIAL PRIMARY KEY,
  projectId INT REFERENCES Project(id)
);
