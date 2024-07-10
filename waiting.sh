#!/usr/bin/env bash
# waiting.sh

set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" > /dev/null 2> /dev/null; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd
