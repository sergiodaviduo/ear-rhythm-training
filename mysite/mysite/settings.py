import os

# The `DYNO` env var is set on Heroku CI, but it's not a real Heroku app, so we have to
# also explicitly exclude CI:
# https://devcenter.heroku.com/articles/heroku-ci#immutable-environment-variables
IS_HEROKU_APP = "DYNO" in os.environ and "CI" not in os.environ

if IS_HEROKU_APP:
    import dj_database_url

from pathlib import Path


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-()d!i7xpf#0m#gdco7uz4%(o(cyq+xr7c@8@^5&%d8i=if38n#'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

if IS_HEROKU_APP:
    # On Heroku, it's safe to use a wildcard for `ALLOWED_HOSTS`, since the Heroku router performs
    # validation of the Host header in the incoming HTTP request. On other platforms you may need to
    # list the expected hostnames explicitly in production to prevent HTTP Host header attacks. See:
    # https://docs.djangoproject.com/en/5.1/ref/settings/#std-setting-ALLOWED_HOSTS
    ALLOWED_HOSTS = ["*"]

    # Redirect all non-HTTPS requests to HTTPS. This requires that:
    # 1. Your app has a TLS/SSL certificate, which all `*.herokuapp.com` domains do by default.
    #    When using a custom domain, you must configure one. See:
    #    https://devcenter.heroku.com/articles/automated-certificate-management
    # 2. Your app's WSGI web server is configured to use the `X-Forwarded-Proto` headers set by
    #    the Heroku Router (otherwise you may encounter infinite HTTP 301 redirects). See this
    #    app's `gunicorn.conf.py` for how this is done when using gunicorn.
    #
    # For maximum security, consider enabling HTTP Strict Transport Security (HSTS) headers too:
    # https://docs.djangoproject.com/en/5.1/ref/middleware/#http-strict-transport-security
    SECURE_SSL_REDIRECT = True
else:
    ALLOWED_HOSTS = [".localhost", "127.0.0.1", "[::1]", "0.0.0.0", "[::]"]

# Application definition

INSTALLED_APPS = [
    # 'polls.apps.PollsConfig',
    'music_training.apps.MusictrainingConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

if IS_HEROKU_APP:
    MIDDLEWARE = [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
        "django.middleware.security.SecurityMiddleware",
        "whitenoise.middleware.WhiteNoiseMiddleware"
    ]
else:
    MIDDLEWARE = [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware'
    ]

ROOT_URLCONF = 'mysite.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

''' 'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': BASE_DIR / 'db.sqlite3',
} '''



if IS_HEROKU_APP:
    # In production on Heroku the database configuration is derived from the `DATABASE_URL`
    # environment variable by the dj-database-url package. `DATABASE_URL` will be set
    # automatically by Heroku when a database addon is attached to your Heroku app. See:
    # https://devcenter.heroku.com/articles/provisioning-heroku-postgres#application-config-vars
    # https://github.com/jazzband/dj-database-url
    DATABASES = {
        'default': dj_database_url.config(
            env="DATABASE_URL",
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=True,
        ),
    }

    WSGI_APPLICATION = 'mysite.wsgi.application'
    STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    }
}
else:
    # When running locally in development or in CI, a sqlite database file will be used instead
    # to simplify initial setup. Longer term it's recommended to use Postgres locally too.
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'postgres', 
            'USER': 'postgres',
            'PASSWORD': 'password',
            'HOST': '127.0.0.1', 
            'PORT': '5432',
        }
    }


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Los_Angeles'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# WhiteNoise

STATIC_ROOT = BASE_DIR / "staticfiles"


# Customise the default logging config, since by default full Django logs are only emitted when
# `DEBUG=True` (which otherwise makes diagnosing errors much harder in production):
# https://docs.djangoproject.com/en/5.1/ref/logging/#default-logging-configuration
# For more advanced logging you may want to try: https://django-structlog.readthedocs.io
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {
            "format": "[{levelname}] {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
    },
    # Fallback for anything not configured via `loggers`.
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            # Prevent double logging due to the root logger.
            "propagate": False,
        },
        "django.request": {
            # Suppress the WARNINGS from any HTTP 4xx responses (in particular for 404s caused by
            # web crawlers), but still show any ERRORs from HTTP 5xx responses/exceptions.
            "level": "ERROR",
        },
    },
}