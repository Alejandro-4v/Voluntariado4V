FROM node:22-slim AS build

WORKDIR /app

COPY Angular/WebVoluntariado/package*.json ./
RUN npm install

COPY Angular/WebVoluntariado/ .
RUN npm run build -- --configuration production

FROM nginx:stable-alpine

COPY --from=build /app/dist/WebVoluntariado/browser /usr/share/nginx/html

COPY docker/images/angular/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
