# Copied from https://docs.astro.build/en/recipes/docker/#multi-stage-build-using-ssr

FROM node:latest AS base
WORKDIR /app

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json package-lock.json ./

FROM base AS prod-deps
RUN npm install --omit=dev

FROM base AS build-deps
RUN npm install

FROM build-deps AS build
COPY . .
ARG NODE_ENV=production
ARG ASTRO_DB_REMOTE_URL
ENV NODE_ENV=${NODE_ENV}
ENV ASTRO_DB_REMOTE_URL=${ASTRO_DB_REMOTE_URL}
RUN npm run build -- --remote

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs
