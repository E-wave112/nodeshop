from node as prod

WORKDIR /app

COPY package*.json ./

RUN npm install


EXPOSE 4000


COPY  . .

CMD [ "npm","start" ]

#DEV DOCKERFILE
from prod as dev

ENV NODE_ENV=development

RUN npm install -g nodemon

RUN npm install --only=dev

EXPOSE 3000


CMD ["npm","run","dev"]
