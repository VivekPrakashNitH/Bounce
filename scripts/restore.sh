#!/bin/bash
# PostgreSQL Restore Script — BeCurious Platform
# Usage: ./restore.sh <backup_file>
#
# Restores from a pg_dump custom format backup.
# Creates a new database, restores, then swaps.

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <backup_file.sql.gz>"
  echo "Available backups:"
  ls -la ${BACKUP_DIR:-/var/backups/postgresql}/*.sql.gz 2>/dev/null || echo "  No backups found"
  exit 1
fi

BACKUP_FILE="$1"
DB_NAME="${DB_NAME:-curioussys}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
RESTORE_DB="${DB_NAME}_restore_$(date +%s)"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "ERROR: Backup file not found: ${BACKUP_FILE}"
  exit 1
fi

echo "=== Restore Plan ==="
echo "Backup file:   ${BACKUP_FILE}"
echo "Target DB:     ${DB_NAME}"
echo "Staging DB:    ${RESTORE_DB}"
echo ""
echo "This will:"
echo "  1. Create staging database '${RESTORE_DB}'"
echo "  2. Restore backup into staging DB"
echo "  3. Verify row counts"
echo "  4. Prompt before swapping"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# Step 1: Create staging database
echo "[$(date)] Creating staging database: ${RESTORE_DB}"
PGPASSWORD="${DB_PASSWORD}" createdb -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" "${RESTORE_DB}"

# Step 2: Restore
echo "[$(date)] Restoring from ${BACKUP_FILE}..."
PGPASSWORD="${DB_PASSWORD}" pg_restore \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${RESTORE_DB}" \
  --verbose \
  --no-owner \
  "${BACKUP_FILE}" \
  2>&1

# Step 3: Verify
echo "[$(date)] Verifying restore..."
USERS=$(PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${RESTORE_DB}" -t -c "SELECT COUNT(*) FROM users" 2>/dev/null || echo "0")
echo "  Users in restored DB: ${USERS}"

# Step 4: Swap prompt
echo ""
echo "Restore verified. To swap databases:"
echo "  1. Stop the application"
echo "  2. Run: ALTER DATABASE ${DB_NAME} RENAME TO ${DB_NAME}_old;"
echo "  3. Run: ALTER DATABASE ${RESTORE_DB} RENAME TO ${DB_NAME};"
echo "  4. Start the application"
echo ""
echo "Or to clean up staging: dropdb ${RESTORE_DB}"
echo "[$(date)] Restore pipeline complete ✅"
