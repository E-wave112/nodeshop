from node as prod

WORKDIR /app

COPY package*.json ./

RUN npm install


EXPOSE 3000

EXPOSE $PORT
COPY  . .

CMD [ "npm","start" ]