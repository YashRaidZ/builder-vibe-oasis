#!/bin/bash

# IndusNetwork PostgreSQL Setup Script
# This script sets up the PostgreSQL database for IndusNetwork

set -e

echo "🚀 IndusNetwork PostgreSQL Setup"
echo "=================================="

# Check if DATABASE_URL is provided
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is required"
    echo "   Example: DATABASE_URL=postgresql://user:pass@host:5432/dbname"
    exit 1
fi

echo "📊 Database URL: $DATABASE_URL"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql command not found"
    echo "   Please install PostgreSQL client tools"
    exit 1
fi

# Check if schema file exists
SCHEMA_FILE="database/indusnetwork_postgresql.sql"
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Error: Schema file not found: $SCHEMA_FILE"
    echo "   Please make sure you're running this from the project root"
    exit 1
fi

echo "📁 Schema file found: $SCHEMA_FILE"

# Test database connection
echo "🔌 Testing database connection..."
if ! psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo "❌ Error: Cannot connect to database"
    echo "   Please check your DATABASE_URL and ensure the database is running"
    exit 1
fi

echo "✅ Database connection successful"

# Check if tables already exist
echo "🔍 Checking for existing tables..."
TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users';" 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "⚠️  Warning: Tables already exist in the database"
    read -p "   Do you want to continue? This may cause conflicts. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   Setup cancelled"
        exit 1
    fi
fi

# Import the schema
echo "📋 Importing database schema..."
if psql "$DATABASE_URL" -f "$SCHEMA_FILE" > /dev/null 2>&1; then
    echo "✅ Schema imported successfully"
else
    echo "❌ Error: Failed to import schema"
    echo "   Check the error messages above for details"
    exit 1
fi

# Verify installation
echo "🔍 Verifying installation..."
RANK_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM ranks;" 2>/dev/null || echo "0")
USER_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")

echo "📊 Database Statistics:"
echo "   - Ranks: $RANK_COUNT"
echo "   - Users: $USER_COUNT"

if [ "$RANK_COUNT" -ge 10 ] && [ "$USER_COUNT" -ge 1 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Update your .env file with the DATABASE_URL"
    echo "   2. Change the default admin password"
    echo "   3. Configure your Minecraft plugin"
    echo "   4. Test the website integration"
    echo ""
    echo "🔐 Default Admin Credentials:"
    echo "   Username: admin"
    echo "   Email: admin@indusnetwork.com"
    echo "   Password: admin123 (⚠️  CHANGE THIS IMMEDIATELY!)"
    echo ""
    echo "📚 Documentation: database/DATABASE_SETUP.md"
else
    echo "⚠️  Warning: Setup may not be complete"
    echo "   Expected 10+ ranks and 1+ user, but found $RANK_COUNT ranks and $USER_COUNT users"
fi

echo ""
echo "🎮 Your IndusNetwork database is ready!"
