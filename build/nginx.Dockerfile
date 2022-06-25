FROM nginx

COPY dist/ /usr/share/nginx/html
COPY build/nginx.conf /etc/nginx/nginx.conf
