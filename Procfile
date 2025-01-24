release: cd mysite && python manage.py migrate
web: cd mysite && gunicorn --config gunicorn.conf.py mysite.wsgi