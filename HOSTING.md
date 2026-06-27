# Hosting the documentation index (governance + access control)

The build produces `dist/index.html` — an on-screen front door to the controlled
embryology suite — plus every document's HTML and PDF, the bound manual and the
register. **These are CONTROLLED CLINICAL DOCUMENTS** (patient consent forms,
SOPs). They must **never** be reachable from a public URL.

## Decision

Host on the existing Oxford Medical **clinical-tools VPS** (`oxmedkw.app`,
`134.122.96.124`), the same box and login surface as the other tools, served as
a new route:

> **Stable URL: `https://oxmedkw.app/lab-docs/`**

This was chosen over GitHub Pages (private-repo Pages on this account would be
public or unavailable — a confidentiality risk) and over artifact-only hosting
(no stable URL, no dashboard tile).

## ⚠ Access-control gap you MUST close before publishing

The clinical-tools site's authentication is **client-side only**: `auth.js`
calls `requireAuth()`, which redirects an unauthenticated browser to `/login`.
nginx still serves every static file directly, and the IP allowlist in
`nginx-clinical-tools.conf` (Layer 1) is currently **commented out (TODO)**.

That posture is acceptable for calculators, but for controlled documents it is
not: a known URL such as
`https://oxmedkw.app/lab-docs/pdf/OMK-FORM-EMB-0053.pdf` would be **directly
downloadable without logging in**. The client-side redirect cannot stop it.

**Add a server-side gate on the `/lab-docs/` location before the first deploy.**
Two options (pick one):

### Option A — HTTP Basic auth on the route (recommended, self-contained)

On the VPS (edit the live nginx config directly — never rsync the repo's
`nginx-clinical-tools.conf`, it holds placeholders):

```nginx
# Controlled embryology documentation — server-side gated.
location /lab-docs/ {
    auth_basic           "Oxford Medical — Embryology Lab Documentation";
    auth_basic_user_file /etc/nginx/lab-docs.htpasswd;
    autoindex            off;
    try_files $uri $uri/ =404;
}
```

Create the credentials file (one or more lab users):

```bash
ssh root@134.122.96.124
apt-get install -y apache2-utils                 # provides htpasswd
htpasswd -c /etc/nginx/lab-docs.htpasswd embryology   # prompts for a password
nginx -t && systemctl reload nginx
```

### Option B — IP allowlist on the route (clinic network only)

```nginx
location /lab-docs/ {
    allow 1.2.3.4;        # clinic public IP
    allow 5.6.7.8;        # remote practitioner(s)
    deny  all;
    try_files $uri $uri/ =404;
}
```

(Option A also works off-site; Option B is simplest if access is only ever from
the clinic network. They can be combined for defence in depth.)

## Verify the gate (do this BEFORE telling anyone the URL)

```bash
# Must be 401 (Option A) or 403 (Option B) — NOT 200:
curl -so /dev/null -w '%{http_code}\n' https://oxmedkw.app/lab-docs/pdf/OMK-FORM-EMB-0053.pdf
# Same for the index and an HTML doc:
curl -so /dev/null -w '%{http_code}\n' https://oxmedkw.app/lab-docs/
```

If any returns `200` unauthenticated, **stop** — the documents are exposed.

## Publishing

1. Confirm the gate is live and verified (above).
2. Add the repository secret `VPS_SSH_PRIVATE_KEY` (the deploy key whose public
   half is in `root@134.122.96.124:~/.ssh/authorized_keys`).
3. Run the **“Deploy lab-docs to VPS”** workflow manually
   (Actions → Run workflow → type `deploy` to confirm). It builds `dist/` and
   rsyncs it **additively** into `/opt/oxmedkw/deploy/lab-docs/` — a dedicated
   subdirectory, so it never touches the other tools or the patient
   Document Ledger. There is no auto-deploy on push, by design.
4. Re-run the verification `curl`s against the live URL.

The dashboard tile (in `om-software`) links to `https://oxmedkw.app/lab-docs/`.
