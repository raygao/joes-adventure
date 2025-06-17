# Chapter 12 - Helm Charts
In this chapter, we will learn how to use Helm Chart to deploy to kubernetes cluster.
- First, we build docker container and tag it with a name.
  - Frontend runs on port 3000
  - Backend runs on port 3500 and uses pm2 (production grade). You can also use the nginx as load-balancer to expose port 3500. (see the nginx-tcp-3500-map.yaml file)
  - Remember to set your Claude API key in the corresponding .env file, before you build your image.
- Second, edit the /etc/hosts file, where 127.0.0.1 are exposed and named.
  - 127.0.0.1 frontend.local backend.local
- Once running, you can access it in a browser:
  - http://frontend.local:3000
  - Als remember, to expose the backend via:
    - kubectl port-forward svc/backend 3500:3500
- For question, please see kubernetes documentation
  - https://kubernetes.io/docs/home/
  - Or just chat it.


## Steps
- Build containers.
- Push containers to docker registry
- Use Helm charts to automate the deployment of containers into k8s
- Do the kubectl network forward, if needed.
- Try and Enjoy. (Always use US city GPS locations.)