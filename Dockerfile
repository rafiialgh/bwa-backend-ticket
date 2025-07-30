FROM node:20

# working directory
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript -> JS
RUN npx tsc

# Run file hasil build
CMD ["node", "dist/index.js"]
