# Unofficial Neuro Karaoke Archive Downloader

A simple site to download the Unofficial Neuro Karaoke Archive.

The name "Unofficial Neuro KAR" derives itself as a play-on of **Kar**aoke **Ar**chive.

Huge thank you to [Swarmtunes](https://swarmtunes.com/) for helping!

## Tooling

- [pnpm](https://pnpm.io/)

    ```bash
    pnpm install
    ```

- VSCode Extensions can be found in `.vscode/extensions.json`

## Cloudflare Workers

In order to get downloads working, the frontend forwards equivalent requests to Cloudflare Workers. These use a Google Service Account to then forward the bytes/files to the user.

This implementation choice is due to Google Drive API Keys causing rate limits and OAuth2 Clients asking for all of a user's drive (with no smaller scope). Should an alternate method show up, these workers may be decomissioned.

### GDrive Service Account

To create your own Service Account:

1. Go to console.cloud.google.com and create a new project

2. Go to APIs & Services

3. Enable -> Google Drive API

4. Credentials -> Create credentials -> Service Account

5. Edit the Service Account -> Keys -> Add key -> JSON

6. The Google Drive folder must explicitly grant/share Viewer access to the Service Account (even if it is public)

### Worker

To create a worker, use the wrangler CLI:

1. Login to Cloudflare with Wrangler:

    ```bash
    pnpm wrangler login
    ```

2. Add secrets

    ```bash
    wrangler secret put
    ```

    1. Add `GOOGLE_SERVICE_ACCOUNT_EMAIL`

    2. Add `GOOGLE_PRIVATE_KEY`

3. Use env templates. Create a copy of the files without the `.template` and fill out the information

    1. `env.local.template` controls the URL to the worker. If left blank will use the localhost (which does not hit the API). If on GitHub Pages, instead add secret `secrets.VITE_WORKER_URL`

    2. `worker/.dev.vars.template` controls the Google Service Account

## Usage & Running

```bash
pnpm run dev
```

The site can be visited from `http://localhost:5173/unofficial-neuro-kar-downloader/`.

## Deployment

```bash
pnpm deploy
```

## Open Source Software

Neuro Unofficial Archive Downloader would not be possible without the following open source software:

| Software                                                                       | License                                                                                                           |
|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| [Swarmtunes](https://github.com/AceandGaming/Swarmtunes-client)                | [MIT](https://github.com/AceandGaming/Swarmtunes-client/blob/main/LICENSE)                                        |
| [Rclone](https://github.com/rclone/rclone)                                     | [MIT](https://github.com/rclone/rclone/blob/master/COPYING)                                                       |

## License

Unofficial Neuro KAR Downloader codebase is licensed under [MIT License](https://github.com/InfornoFire/unofficial-neuro-kar-manager/blob/main/LICENSE)

Images, photographs, and other visual assets in this repository are the property of their respective copyright holders (`All rights reserved`)
