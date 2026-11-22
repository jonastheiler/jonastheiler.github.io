# Kubernetes <Badge type="tip" text="used" />

## The idea

Kubernetes keeps a declared state running. You describe in YAML what should run (deployments,
services, storage), and Kubernetes schedules the containers, restarts them when they fail and
routes traffic to them. For learning, it runs locally with minikube or Docker Desktop.

## Look-up

| Object | Purpose |
|---|---|
| Namespace | Groups the resources of one application |
| Deployment | Runs N copies of a pod and replaces them on updates |
| Service | A stable name and address for a set of pods |
| ConfigMap, Secret | Configuration and credentials, as environment variables or files |
| PersistentVolumeClaim | Storage that survives pod restarts |
| Ingress | HTTP routing from outside the cluster |

```bash
kubectl apply -f k8s/                                   # create or update everything
kubectl get pods -n <namespace> -w                      # watch pods come up
kubectl describe pod <pod> -n <namespace>               # events: scheduling, image pull, probes
kubectl logs <pod> -n <namespace>                       # the container's output
kubectl port-forward svc/<service> 8080:80 -n <namespace>
kubectl rollout restart deploy/<name> -n <namespace>    # pull a new image
```

- Secrets are only base64-encoded, not encrypted.
- For a database with one volume, use `strategy: Recreate`, so two pods never write at once.
- Readiness and liveness probes tell Kubernetes when a pod can take traffic and when to
  restart it.

## Where I used it

- [shiny-k8s-lab](https://github.com/jonastheiler/shiny-k8s-lab): an R Shiny app and PostgreSQL
  on minikube, with a 1 GiB PersistentVolumeClaim, credentials from a Secret, and
  `rollout restart` to pick up new images from CI.

## Sources

- Kubernetes: [Concepts](https://kubernetes.io/docs/concepts/)
- Kubernetes: [Basics tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
