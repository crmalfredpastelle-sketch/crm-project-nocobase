FROM nocobase/nocobase:latest

USER root

# Blitz ejecutará el contenedor como UID 1000.
# Dejamos NocoBase y su almacenamiento accesibles para ese usuario.
RUN mkdir -p /app/nocobase/storage \
    && chown -R 1000:1000 /app/nocobase /app/nocobase/storage \
    && chmod -R u+rwX /app/nocobase

# Blitz no permite a un usuario sin privilegios escuchar en el puerto 80.
ENV APP_PORT=8080
ENV PORT=8080

EXPOSE 8080

USER 1000:1000

CMD ["/app/docker-entrypoint.sh"]
