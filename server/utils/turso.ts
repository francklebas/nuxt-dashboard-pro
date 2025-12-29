import { createClient, type Client } from "@libsql/client";

let tursoClient: Client | null = null;

export const useTurso = () => {
  if (tursoClient) {
    return tursoClient;
  }

  const config = useRuntimeConfig();
  const url = config.tursoDbUrl;
  const authToken = config.tursoAuthToken;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not defined in runtimeConfig");
  }

  tursoClient = createClient({
    url,
    authToken,
  });

  return tursoClient;
};

// Initialize the waitlist table if it doesn't exist
export const initWaitlistTable = async () => {
  const client = useTurso();

  await client.execute(`
    CREATE TABLE IF NOT EXISTS waitlist_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      plan TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
