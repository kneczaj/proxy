# Proxy
This is a full proxy app which supports HTTP, HTTPS and websockets.

## Tests
The functional tests can be run with `yarn test`.

### Running requirements
The HTTPS tests require the DNS to point the host which runs the
tests (usually localhost) to be assigned to `localhost.fakedomain.com`. This is because the certificates are generated
for this domain.

This can be set by adding the following line to `/etc/hosts`"
```
127.0.0.1   localhost.fakedomain.com
```

### Certificates
The certificates in `test` directory are used to run functional tests with HTTPS. They are self-signed and should
not be used for anything else because they are insecure.

They have been generated with the following command:
`openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes -keyout test.key -out test.crt -subj "/CN=localhost.fakedomain.com" -addext "subjectAltName=DNS:localhost.fakedomain.com,DNS:localhost"`
