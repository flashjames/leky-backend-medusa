#!/bin/sh

./tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock --tun=userspace-networking --socks5-server=localhost:1055 --outbound-http-proxy-listen=localhost:1055 &
until ./tailscale up --authkey=${TAILSCALE_AUTHKEY} --hostname=${TAILSCALE_HOSTNAME} --ssh
do
    sleep 0.1
done

npx medusa migrations run && npx pm2 start npm --no-daemon --name 'leky-backend-medusa' -- run start

sleep infinity
