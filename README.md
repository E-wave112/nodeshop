**Node Shop**

A ecommerce web application variant developed using NodeJS,Express,MongoDB, [Docker](https://docs.docker.com/) and [CircleCI](https://circleci.com/) as a CI/CD pipeline


Functionalities include:
- The ability for users to store items in a cart
- The ability for users to make live payments via the integrated [paystack](https://paystack.com/) payment gateway
- The ability for users to filter products based on their categories and purchase any quantity of any product.
- A notification email sent asynchronously to users on completion of ordering or fully purchasing a product.
- A Google Oauth authentication pipeline to verify user's credentials

To get started with this project clone the repo by running the command git clone https://github.com/E-wave112/nodeshop.git or downloading the zip file

In the root of the project run the following command

```
recommended
$ yarn
```

or
```
$ npm install
```
### Build the initial docker image
```
docker-compose up --build
```
### Running the Dev Docker container

To run the application, use the following command:

```
$ docker-compose up
```
The app will be running at http://localhost:3000

A useful resource on how to push your docker image to [DockerHub](https://hub.docker.com)  can be found [here](https://ropenscilabs.github.io/r-docker-tutorial/04-Dockerhub.html)
