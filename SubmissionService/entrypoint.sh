#!/bin/sh

# Wait for the user_db service to be ready
while ! nc -z submission_db 3306; do
  echo "Waiting for submission_db..."
  sleep 2
done

# Run migrations
npx sequelize-cli db:migrate

# Run seeders
npx sequelize-cli db:seed:all

# Start the application
exec "$@"
