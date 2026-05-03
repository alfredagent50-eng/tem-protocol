FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci --workspace apps/api --ignore-scripts

COPY apps/api apps/api
COPY data data

ENV NODE_ENV=production
ENV PORT=8787
EXPOSE 8787

CMD ["npm", "--workspace", "apps/api", "run", "start"]
