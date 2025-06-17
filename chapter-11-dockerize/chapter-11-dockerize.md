# Chapter 11 - Dockerize
In this chapter, we will dockerize (containerize) both applications.
- First, we build docker container and tag it with a name.
  - Frontend runs on port 3000
  - Backend runs on port 3500 and uses pm2 (production grade.)
  - Remember to set your Claude API key in the corresponding .env file, before you build your image.
- Second, we run that docker container.
  - Or, use the provide "docker-compose" to startup both containers.
- You access it at http://localhost:3000

## Start- run backend advisory
``` sh
# With the Docker, run build container image
$ docker build -t backend .
   [+] Building 1.9s (12/12) FINISHED     docker:desktop-linux
$ docker run -p 3500:3500  backend

``` 
## Status - run backend advisory
```
Best to use Docker Desktop for ease of use. https://www.docker.com/products/docker-desktop/
```