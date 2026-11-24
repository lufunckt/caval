#!/bin/sh
set -u
umask 077
mkdir -p /backups
echo "Database backup service started."
while true; do
  file="/backups/erico-$(date -u +%Y%m%dT%H%M%SZ).dump"
  if pg_dump --format=custom --file="$file.partial"; then
    mv "$file.partial" "$file"
    find /backups -maxdepth 1 -type f -name 'erico-*.dump' -mtime +7 -delete
    echo "Database backup completed."
  else
    echo "Database backup failed; check database availability." >&2
  fi
  sleep 86400
done
