
FROM node:22.23.4

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
