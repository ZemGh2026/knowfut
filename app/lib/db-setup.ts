// Run once to create the polls table:
// npx tsx app/lib/db-setup.ts

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function setup() {
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    CREATE TABLE IF NOT EXISTS match_polls (
      match_id        BIGINT PRIMARY KEY,
      votes_home      INTEGER NOT NULL DEFAULT 0,
      votes_draw      INTEGER NOT NULL DEFAULT 0,
      votes_away      INTEGER NOT NULL DEFAULT 0,
      voter_names     TEXT[]  NOT NULL DEFAULT '{}',
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log("✅ match_polls table created successfully");
  process.exit(0);
}

setup().catch((e) => {
  console.error("❌ Setup failed:", e);
  process.exit(1);
});