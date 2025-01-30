# Stage 1: Build the Angular application
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

FROM nginx:alpine

# remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/github-explorer/browser/* /usr/share/nginx/html/

# set proper permissions for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 