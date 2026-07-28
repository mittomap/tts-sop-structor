#!/usr/bin/env bash
# Cap nhat repo private itts-sop: add tat ca, commit, push.
set -euo pipefail
cd "$(dirname "$0")"
git add -A
git commit -m "cap nhat $(date '+%Y-%m-%d %H:%M:%S')" || echo "Khong co thay doi de commit."
git push
