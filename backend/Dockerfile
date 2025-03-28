FROM python:3.9-alpine3.13

ENV PYTHONUNBUFFERED 1

# Install build dependencies for matplotlib and other C extensions
RUN apk add --no-cache \
    build-base \
    libffi-dev \
    musl-dev \
    python3-dev \
    gcc \
    g++ \
    make


COPY ./backend/requirements.txt /tmp/requirements.txt
COPY ./backend/scripts /scripts
COPY ./backend/app /app

WORKDIR /app
EXPOSE 8000

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    rm -rf /tmp && \
    adduser \
    --disabled-password \
    --no-create-home \
    backend-user && \
    mkdir -p /vol/backend/media && \
    chown -R backend-user:backend-user /vol && \
    chmod -R 755 /vol && \
    chmod -R +x /scripts && \
    chmod +x /scripts/run.sh

ENV PATH="/scripts:/py/bin:$PATH"

USER backend-user

CMD ["run.sh"]

