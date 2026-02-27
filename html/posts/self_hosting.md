---
title: "From big to accurate tech: my self-hosted setup"
summary: "From big to accurate tech: my self-hosted setup"
ogType: "article"
date: 2026-02-27
---

# From big to accurate tech: my self-hosted setup
## The mission {#the-mission}
Replacing big tech platforms with self-hosted solutions:
- google drive and calendar -> [nextcloud](https://nextcloud.com/)
- google photos -> [immich](https://immich.app/) 
- spotify -> [navidrome](https://www.navidrome.org/)
- github -> [codeberg](https://codeberg.org/)
- gmail -> [mailbox](https://mailbox.org/en/)
- hacker news -> [freshrss](https://www.freshrss.org/)
- tailscale -> [headscale](https://headscale.net/stable/)
- (bonus track) scattered note taking -> [silverbullet](https://silverbullet.md/)

I built the system myself but you can get there in an afternoon with [yunohost](https://yunohost.org/). It provides a way to self-host a huge amount of apps through a unified interface. I chose not to use it as I wanted to experiment and learn myself how to do it.

All this lives on a Hetzner's CX33 (~ 6.50 euro/month) with a 100GB SSD volume (~3.50 euro/month) and is fully open-source.

I decided not to selfhost emails as it is quite tricky not to get your emails flagged as spam. What I did instead was subscribe to a standard plan at [mailbox.org](https://mailbox.org/en/) and use this websites’s domain as a custom domain for my email (~ 3 euro/month).
<nav class="toc">
    <ul>
        <li><a href="#the-tools">Tools</a></li>
        <li><a href="#the-execution">Execution</a>
        <ul>
           <li><a href="#caddy-setup">Caddy Setup</a></li>
           <li><a href="#headscale-setup">Headscale Setup</a></li>
           <li><a href="#firewalld">Firewalld</a></li>
           <li><a href="#deployment">Deployment</a></li>
        </ul></li>
        <li><a href="#the-conclusion">Conclusion</a></li>
    </ul>
</nav>

## Tools {#the-tools}

- **Nextcloud**: does not need many introductions, a self-hosted cloud service with far more features you will ever use. Used in production by individuals and companies alike. I use it for the sheer simplicity of installing it through the [all in one container](https://github.com/nextcloud/all-in-one). I do not have many requirements for a service like this, I use it for **document and calendary syncing across devices**. All other features I don’t mind but there’s a ton.

- **Immich**: the de-facto standard in open-source image archiving. Actively predates google photos by providing intelligent search and (local) machine-learning features. Clean UX both for the browser and the mobile versions. Provides features to transfer all your library from the most popular services and to batch process your images from the CLI.

- **Navidrome**: Spotify is unbearable, it got so much worse that I could not justify paying for it. I won’t even start on just artist retribution and [AI-weapons support](https://www.deedsmag.com/stories/what-spotifys-latest-controversy-reveals).
Navidrome is not perfect but it works. It is an old-school program, it does just one thing, the music server. This means it does not embed any music player whatsoever, you will need dedicated clients for streaming your music library. I am using [Tempo](https://github.com/CappielloAntonio/tempo) for mobile and [Supersonic](https://github.com/dweymouth/supersonic) for desktop, both quite simple apps that just work. [Symphonium](https://www.symfonium.app/) is pretty widely used but it's closed source, which is a nono.

- **Codeberg + self-hosted Forgejo actions**: I won’t get in too much detail here as I will publish a more in-depth article on Git forges and git alternatives in a bit. [Codeberg](https://codeberg.org/) is a fully-fledged github alternative that under the hood uses [ForgeJo](https://forgejo.org/)  as a git forge. Think of a git forge as a git server with added features such as pull-requests, project management, wikis, static website serving, and all the other services you expect from Github, Gitlab, Gitea and the likes. I am a firm believer in the publish once syndicate everywhere strategy ([POSSE](https://indieweb.org/POSSE)) so I will be still mirroring to github most of my repos but the core of my work will be developed on [my codeberg account](https://codeberg.org/dpaletti/). That said, as of now I am not hosting my forgejo instance but I am hosting my own forgejo runners (github job runners equivalent) so that I do not have CI limitations and still get to support Codeberg which is a really nice initiative (more on this in the next article).


- **Freshrss**: RSS is one of the most underrate internet technologies. Several websites provide RSS feeds, that is a daily/weekly update on new content you can aggregate all in one app. That app is FreshRSS, a RSS feed aggregator that just works. Clean UI (that’s an acquired taste I fear) and very high quality clients, I am using [Capy Reader](https://capyreader.com/) and the FreshRSS web interface from desktop. Supports categories, feeds and many RSS variations. Definitely the best way to stay updated across multiple blogs, newspapers and news aggregators (still reading Hacker News, not proud of it though).


- **Silverbullet**: one of the services I use most. [Silverbullet](https://silverbullet.md/) is a note-taking browser based application with progressive web apps for all platforms that actually work. I use it mainly from my laptop but I do minor edits from my mobile, works seamlessly. Great level of UX polish, astounding number of features, Lua extensibility and distraction-free editing experience. Offline-first app with great syncing strategies and conflict resolution, the absence of adhoc apps greatly simplifies the design and allows for a very coherent experience across devices and operating systems. This is the first time that I think a progressive web app (PWA) is the right tools for the job. I have completely stopped using [org-mode](https://orgmode.org/) and the first time I actually feel I have the note taking app I want in my hands.


- **Caddy**: from the same VPS I am also serving this website. This is thanks to [Caddy](https://caddyserver.com/) which is a reverse-proxy that also handles certificate renewal so that this website and all other services are accessible through HTTPS. A reverse-proxy is just a way to have a unique entrypoint and to all my services (we will see later how this is actually achieved) and then have my requests redirected to the correct service. Caddy is a tool that just works, there are many others, this works for me and I did not need to look much further but there are many alternatives. For me, automatic certificate management and renewal was enough. All in all, Caddy is a nice solution if you want to ditch Cloudflare.

- **Headscale**: self-hosted tailscale. Tailscale is a mesh VPN but the coordination server it uses is not open-source, while the client is. The idea is to have a central door to which device must be registered otherwise they get rejectd. This way we can handle authentication seamlessly. That central door is the authentication server, and headscale is an open-source implementation of it. The headscale repo is still basically in the hands of the tailscale organization but this is the best I could do. I do not have many more ideas to easily manage device authentication. You will also need some clients and for that I am using the official tailscale clients.

- **Beszel**: I needed something to monitor resource utilization and the state of all the services, Beszel perfectly fits this need. Incredibly easy to install and with a very polished web UI provides: resource utilization, service state, and log for all services. I evaluated a combo of graphana and prometheus but I did not want an overly complicated solution for my very limited needs.


## Execution {#the-execution}
From now on I will talk about the deployment you can find in my [repo](https://codeberg.org/dpaletti/self-hosted-services).

The full deployment needs 3 files:
- `docker-compose.yaml`: contains all services as docker containers and inlined configuration files for both Caddy and Headscale
- `firewalld_config.sh`: a firewall(d) configuration script to block all traffic except what’s strictly necessary
- `.env`: secrets and environment variables

Many self-hostable services have docker-compose files ready to go you can simply add to your global configuration. Networking and security are a bit less straightforward but all in all is nothing esoteric. This is the high-level system diagram:

![VPS architecture](../../assets/posts/self_hosted_diagram.webp){width=90%, align="center"}


When a request arrives:
1. firewall blocks everything that is not HTTP(S) or SSH
2. caddy acts as a reverse proxy managing HTTPS, rate limiting and hiding network topology
3. then the request is filtered by headscale that checks whether the device sending the request is allowed to access the service is asking for
4. if everything went well the service is accessible

This kind of configuration allows for seamless access for authorized devices while keeping the server reasonably secure.

We will now take a more in-depth look at some of the services that make this flow possible. I kept everything inside the single compose file to avoid scattering and ease both long maintenance and AI chatbot interaction (I need to copy paste the whole file and I am done). Yes, it’s no agentic AI setup but one of the main reason I developed this is to understand the ins and outs of the solution. On top of this, I did not want to lose control over the design, longterm maintenance cost is paramount and AI usually trades this off with shorterm sub-optimal working solutions that accrue a lot of technical debt over time. This is to say, I used AI sparingly to build this, mainly to round some corners.

### Caddy setup {#caddy-setup}
Caddy is the reverse-proxy that handles all traffic to the server, including the traffic to this website. There is an official image that I extended with a plugin for rate limiting access to this blog:
```dockerfile
caddy:
  build:
    context: .
    dockerfile_inline: |
      FROM caddy:builder AS builder
      RUN xcaddy build \
          --with github.com/mholt/caddy-ratelimit

      FROM caddy:latest
      COPY --from=builder /usr/bin/caddy /usr/bin/caddy
  container_name: caddy
  restart: always
  volumes:
    - caddy_certs:/certs
    - caddy_config:/config
    - caddy_data:/data
    - caddy_sites:/srv
    - /root/blog:/blog
  network_mode: "host"
  configs:
  - source: Caddyfile
    target: /etc/caddy/Caddyfile
```
The idea here is using inline dockerfile to keep everything in one file as much as possible. So much that also the Caddy config file is inside the same docker-compose file. In this section and all the subsequent ones I will pick only the most relevant bits of the docker-compose file which is quite long (and boring) to be fully discussed in this article. Again, you find the full file in my [repo](https://codeberg.org/dpaletti/self-hosted-services).

Then, to actually serve the blog and rate limit it:
```dockerfile
configs:
  Caddyfile:
    content: |
  (rate_limit_blog) {
      rate_limit {
          zone blog {
              key {remote_ip}
              events 500
              window 1s
              burst 100
          }
      }
  }

  $DOMAIN {

      import rate_limit_blog
      root * /blog

      encode zstd gzip

      header {
          Strict-Transport-Security "max-age=31536000; includeSubDomains"
          X-XSS-Protection "1; mode=block"
          X-Frame-Options "DENY"
          Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'"
      }

      file_server
  }
```

Any other service you want to add which you want to serve just needs basic reverse-proxy configuration. In my case, I decided to use this domain as the basis of all my networking configuration so for instance I wanted to access FreshRSS at `rss.dpaletti.com`. This means, that you need to setup DNS records at your domain registrar (I use [porkbun](https://porkbun.com/) and it works quite well) and then add to the caddy configuration something like:
```dockerfile
rss.$DOMAIN {
           reverse_proxy 127.0.0.1:8081
}
```
Above we assume that the FreshRSS service container is defined along the lines of:
```dockerfile
  freshrss:
    image: freshrss/freshrss:latest
    container_name: freshrss
    hostname: freshrss
    restart: unless-stopped
    logging:
      options:
        max-size: 10m
    volumes:
      - rss_data:/var/www/FreshRSS/data
      - rss_extensions:/var/www/FreshRSS/extensions
    ports:
      - "127.0.0.1:8081:80"
```
Where the original port 80 gets mapped to 8081 so avoiding clash with other services which may use port 80 by default.

At this point, we have a working reverse proxy configuration but anyone can access `rss.dpaletti.com`. In general, we assume a login page at that point but I would prefer to keep these services private given that I am also archiving personal photos and notes. To do this, we deploy headscale.

### Headscale {#headscale-setup}
The main objective here is having a way to securely connect to my services by recording which devices are allowed access to the services.
```dockerfile
headscale:
    image: headscale/headscale:latest
    container_name: headscale
    restart: unless-stopped
    command: serve
    configs:
      - source: headscale_config
        target: /etc/headscale/config.yaml
    volumes:
      # Use a named volume for the database and keys
      - headscale_data:/var/lib/headscale
      - headscale_run:/var/run/headscale
    dns:
      - 8.8.8.8
      - 1.1.1.1
    ports:
      - "127.0.0.1:8085:8080"
      - "127.0.0.1:9090:9090"
      - "3478:3478/udp"
    healthcheck:
      test: ["CMD", "headscale", "health"]
```
This is headscale docker-compose configuration, almost everything copy pasted from the docs with slight adaptations:
1. configs: I decided I wanted to inline headscale config so to have everything in one file
2. lables and networks: this is beszle specific config so that we can monitor resource utilization (you will find this attached to all services)
3. port mapping: avoid clash with other services

Now we want to route traffic from caddy through tailscale. To accomplish this we need to slightly extend the caddy config file:
```dockerfile
(private) {
          @denied not remote_ip 100.64.0.0/10 fd7a:115c:a1e0::/48 127.0.0.1 ::1 2a01:4f8:1c1a:5a7b::1
          respond @denied "Access Denied: You are not on the private network." 403
      }
```

This rule checks whether the device is succesfully logged into tailscale, if not it gets bounced. Last step is enforcing this rule for all traffic we want to filter, our FreshRSS rule becomes:
```dockerfile
rss.$DOMAIN {
         import private
         reverse_proxy 127.0.0.1:8081
}
```

At this point, we need the tailscale log-in flow to work. To accomplish that we expose the headscale coordination server through Caddy and we configure it appropriately:
```dockerfile
 headscale.$DOMAIN {
   handle /web* {
       import private
       reverse_proxy 127.0.0.1:8086
  }
```


The trickiest part is the headscale-config:
```dockerfile
      server_url: https://headscale.dpaletti.com:443
      [... defaults skipped, find the whole config in the repo ...]
      derp:
        server:
          enabled: true
          region_id: 999

          region_code: "headscale"
          region_name: "Headscale Embedded DERP"

          verify_clients: true

          stun_listen_addr: "0.0.0.0:3478"

          private_key_path: /var/lib/headscale/derp_server_private.key

          automatically_add_embedded_derp_region: true

          ipv4: 46.224.25.148

        urls: []

        paths: []

        auto_update_enabled: false

        update_frequency: 3h

      dns:
        magic_dns: true

        base_domain: vpn.dpaletti.com

        override_local_dns: true

        nameservers:
          global:
            - 8.8.8.8
            - 1.1.1.1

          split: {}

        search_domains: []
        extra_records:
          - name: "rss.dpaletti.com"
            type: "A"
            value: "100.64.0.1"
          [... some more records ...]
          - name: "rss.dpaletti.com"
            type: "AAAA"
            value: "fd7a:115c:a1e0::1"
    [... some more defaults ...]
```
The most important section is noting that for every service I want to expose I need to update magic DNS so that headscale correctly redirects to the requested service.

This allows to expose services on subdomains of the domain hosting my blog while keeping access only to desired devices without recurring to Tailscale’s closed source coordination server.

### Firewalld {#firewalld}
[Firewalld](https://firewalld.org/) is truely great and easy to use. The main idea is that changes can be done immediately in the runtime environment without service restart. I am not an expert on this, so I got a very barebones configuration practically blacklisting all connections and keeping only the ones I needed. On top of that, I enabled masquerading (network address translation) to allow FreshRSS to download the feeds. This is all my configuration which I keep in a `.sh` file which I can easily run to apply:
```sh
echo "==> Enabling firewalld"
systemctl enable --now firewalld

echo "==> Reload (clean slate)"
firewall-cmd --reload

echo "==> Setting default zone to public"
firewall-cmd --set-default-zone=public

echo "==> Enabling Masquerading (Required for container outbound traffic)"
firewall-cmd --permanent --zone=public --add-masquerade

echo "==> Explicitly allowing essential public services"
firewall-cmd --permanent --zone=public --add-service=ssh
firewall-cmd --permanent --zone=public --add-service=http
firewall-cmd --permanent --zone=public --add-service=https
firewall-cmd --permanent --zone=public --add-port=3478/udp

echo "==> Reloading firewall rules"
firewall-cmd --reload
```
The main idea is setting the default zone to public so that all connections are blocked by default. Then, add essential connections to the public zone to allow them. Very simple setup, again, I am not good at this stuff.

### Deployment {#deployment}
Deploying all this is done through a Forgejo action from my repo. Forgejo actions are Github action compatible so it is pretty straightforward to write one, you can find the full implementation [here](https://codeberg.org/dpaletti/self-hosted-services/src/branch/main/.forgejo/workflows/deploy.yaml). 
First we checkout the repo and retrieve secrets (much like github) and paste them in the `.env` file:
```yaml
    steps:
      - name: Checkout repository
        uses: https://github.com/actions/checkout@v6

      - name: Update .env file with secrets
        run: |
          sed -i "s|SILVERBULLET_USER=.*|SILVERBULLET_USER=${{ secrets.SILVERBULLET_USER }}|g" synced/.env
          sed -i "s|SILVERBULLET_PSW=.*|SILVERBULLET_PSW=${{ secrets.SILVERBULLET_PSW }}|g" synced/.env
          sed -i "s|BESZEL_TOKEN=.*|BESZEL_TOKEN=${{ secrets.BESZEL_TOKEN }}|g" synced/.env
          sed -i "s|BESZEL_KEY=.*|BESZEL_KEY=${{ secrets.BESZEL_KEY }}|g" synced/.env
```
Then, we sync everything to the VPS through `rsync`, this is a good example of using a github action inside a forgejo action:
```yaml
      - name: Sync to VPS
        uses: https://github.com/burnett01/rsync-deployments@v8
        with:
          switches: -avzr
          path: synced/
          remote_path: ${{ secrets.VPS_SETUP_REMOTE_PATH }}
          remote_host: ${{ secrets.VPS_SSH_HOST }}
          remote_port: 22
          remote_user: ${{ secrets.VPS_SSH_USER }}
          remote_key: ${{ secrets.VPS_SSH_PRIVATE_KEY }}
```
Finally we apply firewall and docker config using SSH keys we are keeping as secrets:
```yaml
      - name: Execute deployment commands
        uses: https://github.com/appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_SSH_HOST }}
          port: 22
          username: ${{ secrets.VPS_SSH_USER }}
          key: ${{ secrets.VPS_SSH_PRIVATE_KEY }}
          script: |
            chmod +x firewalld_config.sh
            ./firewalld_config.sh
            docker compose up -d
```
# Conclusion {#the-conclusion}
It’s been quite a ride. This setup has been working for several months without additional tweaking. Removing platforms from my life has been really beneficial. Far lowered general internet usage, got back to discovering music and movies from long-form blogs instead of doom scrolling algorithms. Along these lines, I have also opened a [Mastodon profile](https://social.coop/@dpaletti) which helps me discovering interesting people and discussions, I have been using it with Phanpy

[Yunohost](https://yunohost.org/) can be a really good tradeoff between effort and independence leaving the most with no excuses to keep using enshittified, expensive, privacy violating services.
