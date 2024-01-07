-- Create Guild table if not exists
CREATE TABLE IF NOT EXISTS Guild (
  id BIGINT PRIMARY KEY,
  roleId BIGINT
);

-- Create Project table if not exists
CREATE TABLE IF NOT EXISTS Project (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255),
  guildId BIGINT REFERENCES Guild(id),
  ownerId BIGINT,
  categoryId BIGINT,
  devRoleId BIGINT,
  roleId BIGINT,
  webhookId BIGINT
);

-- Create Channel table if not exists
CREATE TABLE IF NOT EXISTS Channel (
  id BIGINT PRIMARY KEY,
  guildId BIGINT REFERENCES Guild(id),
  projectId BIGINT REFERENCES Project(id),
  name VARCHAR(255),
  type INT
);

-- Create Role table if not exists
CREATE TABLE IF NOT EXISTS Role (
  id BIGINT PRIMARY KEY,
  projectId BIGINT REFERENCES Project(id),
  isDev BOOLEAN
);

-- Create Webhook table if not exists
CREATE TABLE IF NOT EXISTS Webhook (
  id BIGINT PRIMARY KEY,
  projectId BIGINT REFERENCES Project(id)
);
