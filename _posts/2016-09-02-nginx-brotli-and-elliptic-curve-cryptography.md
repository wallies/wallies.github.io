---
layout: post
title: "Nginx using Brotli compression and Elliptic Curve Cryptography"
description: "Implementing Brotli compression and Elliptic Curve Cryptography with Nginx"
category: "Security"
author: cam_parry
tags: [Devops, Docker, Security, Docker Compose]
comments: true
share: true
---

So I am going to test out Googles new [Brotli](https://github.com/google/brotli) compression and while I'm at it show you how to configure nginx with some basic defaults, as well as show you how to use [Elliptic curve cryptography](https://en.wikipedia.org/wiki/Elliptic_curve_cryptography), as an alternative to RSA. I will be doing this with Nginx compiled with [BoringSSL](https://www.chromium.org/Home/chromium-security/boringssl) using the awesome work done by Wonderwall - [BoringNginx Container](https://hub.docker.com/r/wonderfall/boring-nginx/).

All source code examples for this are here https://github.com/wallies/nginx-ssl-experiments and demo can be seen here ssldemo.redfog.io

I are going to do this locally first using docker compose. So first we have to generate a self signed certificate but we can't just do this the standard way as we want to generate a [Elliptic curve cryptography](https://en.wikipedia.org/wiki/Elliptic_curve_cryptography) certificate. I am not going to touch on the issue of ECC vs RSA as that is already covered in depth before.
Now we are going to use OpenSSL 1.1.0 which has changed syntax a bit and also because it supports ChaCha20 and Poly1305 ciphers. SSL Cipher suites were obtained from [Mozilla Security/Server Side TLS](https://wiki.mozilla.org/Security/Server_Side_TLS). I have prebuilt the source into a container [here](https://hub.docker.com/r/wallies/openssl/), so we can utilise new openssl ciphers and features.

```
docker run --rm -it --name openssl wallies/openssl openssl ecparam -list_curves

docker run --rm -it --name openssl -v $(pwd)/certs:/certs wallies/openssl openssl ecparam -out /certs/ec_key.pem -name secp384r1 -noout -genkey

docker run --rm -it --name openssl -v $(pwd)/certs:/certs -e ALT_NAME="DNS:pagekite.me,DNS:ssldemo.pagekite.me" wallies/openssl openssl req -new -key /certs/ec_key.pem -sha256 -nodes -outform pem -reqexts SAN -subj "/C=UK/ST=London/L=London/O=pagekite/OU=IT/CN=pagekite.me" -out /certs/ecc.csr

docker run --rm -it --name openssl -v $(pwd)/certs:/certs wallies/openssl openssl req -x509 -sha256 -days 365 -key /certs/ec_key.pem -in /certs/ecc.csr -subj "/C=UK/ST=London/L=London/O=xip/OU=IT/CN=pagekite.me" -out /certs/ecc_cert.pem
```

This will create an Elliptic curve cryptography certificate private key, signing request and then use the letsencrypt client to create a valid certificate.

I decided to use Elliptic curve Diffie-Hellman (ECDH) as it is a key agreement protocol allowing two parties, each having an elliptic curve public-private key pair, to establish a shared secret over an insecure channel. I was then going to use ssl ecdh curve secp521r1, as on one hand secp384r1 is a 384 bit Elliptic curve which most efficiently supports ssl_ciphers up to a SHA-384 hash and is compatible with all desktop and mobile clients. Using a larger hash value, like secp521r1, and then truncating down to 384 or 256 wastes around one(1) millisecond of extra cpu time. On the other hand, we are using secp521r1 due to its more difficult cracking potential and the fact that older OS's like XP can not solve the equation; i.e. those old compromised machines can not connect to us. Currently letsencrypt do not support the secp521r1 curve, so for now we will stick with secp384r1.
Take a look at the NSA's paper titled, [The Case for Elliptic Curve Cryptography](http://www.smithandcrown.com/open-research/the-case-for-elliptic-curve-cryptography/) for more details.


For turning on Brotli compression we simply add the following to our nginx.conf file. 

```
brotli on;
brotli_static on;
brotli_buffers 16 8k;
brotli_comp_level 6;
brotli_types
  text/css
  text/javascript
  text/xml
  text/plain
  text/x-component
  application/javascript
  application/x-javascript
  application/json
  application/xml
  application/rss+xml
  application/vnd.ms-fontobject
  font/truetype
  font/opentype
  image/svg+xml;
```


In terms of Brotli compression level, there is a clear win enabling brotli level 1 if you had gzip level 1 enabled or brotli level 5 if you were comfortable with the CPU cost of gzip level 9 on dynamic assets and have capacity and can expect a 5-10% win size. 
On the other hand if you just have static assets you can compress these ahead of time by just using brotli cli e.g. 

```
bro --input css/styles.css --output dist/css/styles.css.br
```

When testing Brotli in your browser we are looking for the '**Accept-Encoding**' header under the Request headers section, as this is the browser signalling to the server what kinds of compressed content it can decompress with, so we are looking for " **Accept-Encoding: 'gzip, deflate, br'** ".

We then start up our docker compose dev setup, expose it using ngrok or pagekite and test against https://www.htbridge.com/websec/. This will just test our Nginx Server configuration. I tried to expose through ngrok or pagekite so I could try and use letsencrypt via a tunnel but it wasn't working, so have decided all I need to really do is validate my server configuration. You will notice we are using docker-compose with overrides here, which I find useful if using docker-compose for different environments or different test cases with a shared base configuration. I have also added the seccomp security option to the prod docker-compose file, which is just a copy of the default one which is used by docker, but it does show what the defaults you are getting.

```
### Start dev setup
docker-compose -f docker-compose.yml -f docker-compose-dev.yml up -d

### Expose service to internet
docker run -it --rm --net host --name pagekite wattos/docker-pagekite 443 https://ssldemos.pagekite.me:443
```

Now that we have confirmed the browser supports the brotli encoding, we must confirm that the server supports the compression as well, so we will look at the '**Content-Encoding**' header under the Response headers section. We should see " **Content-Encoding: 'br'** " , as this is what we turned on for nginx which is serving our application.

Now that we have tested everything is working locally, we can set it up on a live server. 
We run the below script, which will setup our letsencypt certificate using our previously generated key and signing request. It will then use docker-machine to startup a server on digital ocean, you can change this by using a different docker-machine driver. It will then grab the docker environment variables for that machine so we can run docker-compose against it.  Now we can run our application up and run a full test against [SSL Labs test](https://www.ssllabs.com/ssltest/) or [Free SSL Server Test](https://www.htbridge.com/ssl/).


### Live

```
You will need to export two variables first to talk to digital ocean and then to get the right domain name e.g.

export DOTOKEN=your-api-token
export DOMAIN=dns-domain

sh docker-machine.sh
```

If you are after best current practices regarding configuration of cyptographic tools and online communication, head to [Better Crypto](https://bettercrypto.org/).

### References
- [Compile the newest version of OpenSSL](https://mark911.wordpress.com/2015/01/10/how-to-compile-and-install-newest-version-of-openssl-in-ubuntu-14-04-lts-64-bit-via-github/)
- [Docker nginx image complied with boringssl](https://hub.docker.com/r/wonderfall/boring-nginx/)
- [Secure nginx with SSL & Building BoringSSL with Nginx](https://calomel.org/nginx.html)
- [ECDSA Certs from LetsEncrypt](https://boops.me/how-to-get-a-signed-ecdsa-ecc-cert-from-letsencrypt/)
- [Mozilla Configurator Generator](https://mozilla.github.io/server-side-tls/ssl-config-generator/)
- [Experimenting with Post-Quantum Cryptography](https://security.googleblog.com/2016/07/experimenting-with-post-quantum.html)
- [Microsofts answer to post quantum cryptography](https://www.microsoft.com/en-us/research/project/sidh-library/)
