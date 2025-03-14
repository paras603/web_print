#!/bin/sh

set -e

# python manage.py wait_for_db  # not required for initial phase. 
python manage.py migrate

uwsgi --socket :9000 --workers 4 --master --enable-threads --module app.wsgi
