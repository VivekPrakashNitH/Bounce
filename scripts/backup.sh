#!/bin/bash
# PostgreSQL Backup Script — BeCurious Platform
# Run daily via cron: 0 3 * * * /path/to/backup.sh
#
# Features:
# - Compressed pg_dump with timestamp
# - 30-day retention (auto-delete older backups)
# - Exit code verification
# - Optional upload to S3/GCS (uncomment at bottom)

set -euo pipefail

# ── Configuration ──────────────────────────────────────
BACKUP_DIR="${BACKUP_DIR:-/var/backups/postgresql}"
DB_NAME="${DB_NAME:-curioussys}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

# ── Ensure backup directory ────────────────────────────
mkdir -p "${BACKUP_DIR}"

# ── Create backup ──────────────────────────────────────
echo "[$(date)] Starting backup: ${DB_NAME} → ${BACKUP_FILE}"

PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h "${DB_HOST}" \
  -p "${DB_PORT}" \
  -U "${DB_USER}" \
  -d "${DB_NAME}" \
  --format=custom \
  --compress=9 \
  --verbose \
  --file="${BACKUP_FILE}" \
  2>&1

# ── Verify backup ─────────────────────────────────────
if [ ! -f "${BACKUP_FILE}" ] || [ ! -s "${BACKUP_FILE}" ]; then
  echo "[$(date)] ERROR: Backup file is missing or empty!"
  exit 1
fi

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "[$(date)] Backup complete: ${BACKUP_FILE} (${BACKUP_SIZE})"

# ── Cleanup old backups ───────────────────────────────
DELETED=$(find "${BACKUP_DIR}" -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete -print | wc -l)
echo "[$(date)] Cleaned ${DELETED} backups older than ${RETENTION_DAYS} days"

# ── Optional: Upload to cloud storage ─────────────────
# Uncomment one of these for cloud backup:
#
# AWS S3:
# aws s3 cp "${BACKUP_FILE}" "s3://becurious-backups/${DB_NAME}/"
#
# Google Cloud Storage:
# gsutil cp "${BACKUP_FILE}" "gs://becurious-backups/${DB_NAME}/"

echo "[$(date)] Backup pipeline complete ✅"
