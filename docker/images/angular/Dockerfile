FROM node:22-slim

RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @angular/cli@20.3.14

WORKDIR /app

EXPOSE 4200

CMD ["sh", "-c", "if [ ! -f node_modules/@angular/core/package.json ]; then npm install; fi && npm start -- --host 0.0.0.0"]
