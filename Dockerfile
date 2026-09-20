FROM nocobase/nocobase:latest

USER root

RUN mkdir -p /app/nocobase/storage \
    && chown -R 1000:1000 /app/nocobase \
    && chmod -R u+rwX /app/nocobase

COPY --chown=1000:1000 start-blitz.js /app/start-blitz.js

ENV APP_PORT=8080
ENV PORT=8080

EXPOSE 8080

USER 1000:1000

CMD ["node", "/app/start-blitz.js"]
