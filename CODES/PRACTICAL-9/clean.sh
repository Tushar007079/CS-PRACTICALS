# cleanup-policies.sh

#!/bin/bash

# Delete Calico policies
calicoctl delete policy allow-busybox-egress -n advanced-policy-demo7
calicoctl delete policy allow-nginx-ingress -n advanced-policy-demo7
calicoctl delete gnp default-deny7

# Delete Kubernetes namespace
kubectl delete ns advanced-policy-demo7
