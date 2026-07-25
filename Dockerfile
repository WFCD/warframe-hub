FROM node:lts-alpine AS build

WORKDIR /app
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:lts-alpine AS runtime

LABEL org.opencontainers.image.source="https://github.com/WFCD/warframe-hub"
LABEL org.opencontainers.image.description="Warframe Hub — community worldstate and utility frontend."
LABEL org.opencontainers.image.licenses="Apache-2.0"

WORKDIR /app
ENV HUSKY=0
ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8742

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8742/ >/dev/null || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]
