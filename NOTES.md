# Engineering Notes & Architecture Reference: merlin-tribukait.com

> Technical field notes, deployment guides, Nginx reverse-proxy topologies, SSL/TLS automation, and operational cheatsheets for `https://merlin-tribukait.com/` and the Merlin Tribukait ecosystem.

---

## 1. Domain & Network Topology

| Attribute | Value |
|---|---|
| **Primary Domain** | `https://merlin-tribukait.com/` |
| **Secondary FQDN** | `https://www.merlin-tribukait.com/` |
| **Documentation Portal** | `https://docs.merlin-tribukait.com/` |
| **Brand Assets Hub** | `https://brands.games-reborn.com/` |
| **Game Platform** | `https://games-reborn.com/` |
| **Public Server IPv4** | `85.215.227.241` (Frankfurt am Main, Germany) |
| **Public Server IPv6** | `2a01:239:4db:e600::1` |
| **Interface** | `ens6` (`altname enp0s6`) |
| **Web Server** | Nginx 1.24.0 (Ubuntu) with HTTP/2 and TLS 1.3 |
| **Webroot Path** | `/var/www/merlin-tribukait.com/` |
| **Local Git Repo** | `/home/admin/merlin-tribukait.com/` |
| **GitHub Remote** | `https://github.com/merlin-tribukait/merlin-tribukait.com` |

---

## 2. Nginx Configuration & Port Architecture

### Server Blocks & Routing
- **HTTP (Port 80 & Port 8080)**:
  - Handles Let's Encrypt ACME challenges via `/.well-known/acme-challenge/` pointing to `/var/www/html/`.
  - Automatically redirects all standard HTTP traffic with a `301 Moved Permanently` to `https://$host$request_uri`.
- **HTTPS (Port 443 & Port 8444)**:
  - Listens on dual-stack `0.0.0.0:443` and `[::]:443` with `ssl http2`.
  - Uses ECDSA certificates generated via Let's Encrypt Certbot.
  - Serves static assets with aggressive caching headers (`expires 30d; Cache-Control "public, no-transform"`).
  - Single-Page Application (SPA) routing fallback with `try_files $uri $uri/ /index.html =404`.

### Active Configuration File
`/etc/nginx/sites-available/merlin-tribukait.com` (symlinked into `/etc/nginx/sites-enabled/`):

```nginx
server {
    listen 80;
    listen [::]:80;
    listen 8080;
    listen [::]:8080;
    server_name merlin-tribukait.com www.merlin-tribukait.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    listen 8444 ssl;
    listen [::]:8444 ssl;
    server_name merlin-tribukait.com www.merlin-tribukait.com;

    root /var/www/merlin-tribukait.com;
    index index.html index.htm;

    ssl_certificate /etc/letsencrypt/live/merlin-tribukait.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/merlin-tribukait.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.html =404;
    }

    location ~* \.(?:ico|css|js|gif|jpe?g|png|svg|woff2?|eot|ttf|otf|webp|mp4|webm)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    access_log /var/log/nginx/merlin-tribukait.com.access.log;
    error_log /var/log/nginx/merlin-tribukait.com.error.log;
}
```

---

## 3. SSL / TLS Certificate Lifecycle

Certificates are managed via Let's Encrypt Certbot using the `webroot` plugin against `/var/www/html`:

```bash
# Renew certificates manually (dry-run test)
sudo certbot renew --dry-run

# Re-issue or expand domains
sudo certbot certonly --webroot -w /var/www/html \
  -d merlin-tribukait.com -d www.merlin-tribukait.com \
  --agree-tos --email merlin_felix_@hotmail.com --non-interactive

# Reload Nginx after renewal
sudo systemctl reload nginx
```

Certificates renew automatically via `systemd` timer (`certbot.timer`).

---

## 4. Git & Deployment Pipeline

The production website files are deployed to `/var/www/merlin-tribukait.com/` and version controlled in `/home/admin/merlin-tribukait.com/`.

### Deployment Procedure
```bash
# 1. Edit files in workspace
cd /home/admin/merlin-tribukait.com

# 2. Stage, commit, and push to GitHub
git add -A
git commit -m "Update portfolio content, notes and features"
git push origin main

# 3. Synchronize to webroot
sudo cp -r /home/admin/merlin-tribukait.com/* /var/www/merlin-tribukait.com/
sudo chown -R www-data:www-data /var/www/merlin-tribukait.com/

# 4. Verify live response
curl -sI https://merlin-tribukait.com/
```

---

## 5. Reverse Engineering & Architecture Intel Summary

### Protocol & Systems Scope
- **Total Network Opcodes Disassembled**: `541`
- **Total Binary DTO Schemas Extracted**: `4,221`
- **Canonical Game Subsystems Emulated**: `85`
- **C++17 Game Daemon Core**: `bin/mu3_server --no-cli` (Ports: Auth `4403`, Game `5222/5223`, HTTP API `8081`, Admin `8088`, HTTPS `8443`)
- **Node.js PM2 Ecosystem**: `pm2 reload games-reborn` (Port `3100`, `3000`)
- **MariaDB Database Instance**: Host `127.0.0.1:3306`, Database `mu3_db`, User `mu3_user`

---

## 6. Troubleshooting & Diagnostics

```bash
# Test Nginx configuration syntax
sudo nginx -t

# Check active listening web ports
sudo ss -tulpn | grep -E ':(80|443|8080|8444)\s'

# View live access & error logs
sudo tail -f /var/log/nginx/merlin-tribukait.com.access.log
sudo tail -f /var/log/nginx/merlin-tribukait.com.error.log

# Check Certbot certificate status
sudo certbot certificates
```
