#!/bin/sh
if [ "$DELETE_DB" = "true" ]; then
  echo "🧨 DELETE_DB=true → Clearing DB via raw SQL..."
  pnpx prisma db execute --file=./scripts/clear-db.sql --schema=./prisma/schema.prisma
else
  echo "ℹ️ Skipping DB clear (DELETE_DB != true)"
fi

pnpx prisma migrate deploy && node server.js
