FROM node:22-alpine
WORKDIR /app
COPY package.json .
RUN npm install 
COPY . ./
# COPY ./entrypoint.sh /usr/local/bin/
# RUN chmod +x /usr/local/bin/entrypoint.sh
# ENTRYPOINT ["entrypoint.sh"]
CMD ["npm","run","dev"]