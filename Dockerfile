# FROM caddy:2-builder-alpine as builder
# RUN xcaddy build \
#     --with github.com/caddy-dns/cloudflare

FROM node:15.14.0-alpine

# COPY --from=builder /usr/bin/caddy /usr/bin/caddy

WORKDIR /usr/app
# COPY caddy/Caddyfile /usr/app/Caddyfile
# Change working directory
COPY weedvidio/package*.json /usr/app/
ADD weedvidio/server /usr/app/server
ADD weedvidio/dist /usr/app/dist
ADD weedvidio/node_modules /usr/app/node_modules
COPY devstart.sh /usr/app/
RUN chmod a+x /usr/app/devstart.sh
ENV SERVER_PORT=443
ENV NODE_ENV=production

EXPOSE 80 443

ENTRYPOINT [ "/usr/app/devstart.sh" ] 