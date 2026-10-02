# Plain Docker so the app stays portable (not tied to Railway-only features).
# Usage: docker build --build-arg APP=api -t flb-api .   (APP = api | worker)
FROM node:20-slim AS build
ARG APP=api
WORKDIR /repo
COPY . .
RUN npm install && npm run build -w apps/${APP}

FROM node:20-slim
ARG APP=api
WORKDIR /app
COPY --from=build /repo/apps/${APP}/dist ./dist
COPY --from=build /repo/apps/${APP}/package.json ./package.json
COPY --from=build /repo/db ./db
RUN npm install --omit=dev --ignore-scripts --workspaces=false
ENV MIGRATIONS_DIR=/app/db/migrations
CMD ["node", "dist/index.js"]
