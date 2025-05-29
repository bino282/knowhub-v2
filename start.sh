#!/bin/sh

# Wait for the database to be ready (optional - uncomment and modify if needed)
# echo "Waiting for database to be ready..."
# /app/node_modules/.bin/wait-on tcp:${DATABASE_HOST}:${DATABASE_PORT} -t 60000

# Apply database migrations
echo "Applying database migrations..."
npx prisma migrate deploy

# Generate Prisma client (optional - should be done at build time but added for safety)
echo "Generating Prisma Client..."
npx prisma generate

# Start the application
echo "Starting the application..."
exec node server.js