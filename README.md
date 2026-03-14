# Unofficial Neuro Karaoke Archive Downloader

A simple web app to download the Unofficial Neuro Karaoke Archive.

The name "Unofficial Neuro KAR" derives itself as a play-on of **Kar**aoke **Ar**chive.

Huge thank you to [Swarmtunes](https://swarmtunes.com/) for agreeing to help host the main site!

## Requirements

### Languages/Tools

If you only need to run:

- [pnpm](https://pnpm.io/)

- VSCode Extensions can be found in `.vscode/extensions.json`

```bash
pnpm install
```

### RClone & GDrive (Docker only)

In order to keep an updated version of the archive, the server has a sidecar which syncs the GDrive to a mounted volume regularly.

#### GDrive API (Production Only)

For production environments, it's recommended to use a full GCP project to handle the API requests and avoid limits or TOS issues.

1. Google Drive API is required to automatically download songs. Here is one way to get a key:

    1. Go to console.cloud.google.com and create a new project

    2. Go to APIs & Services

    3. Enable -> Google Drive API

    4. OAuth Client Services

        i. Setup (fill in) -> External

        ii. Audience -> Ensure your account is under Test Users

    5. Credentials -> Create -> Desktop App -> Download JSON -> `credentials.json`

## Usage & Running

### Manual

This is recommended only for live development.

You can run the backend and frontend manually. Make sure to have a `./archive` folder at the root of the repository with the song files (this will not be generated with this setup). The root `package.json` has some scripts to help running (assuming `pnpm` and `bacon` are installed).

```bash
pnpm run dev
```

The site's frontend can be visited from `localhost:5317` and its backend from `localhost:3000`.

## Open Source Software

Neuro Unofficial Archive Downloader would not be possible without the following open source software:

| Software                                                                       | License                                                                                                           |
|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| [Swarmtunes](https://github.com/AceandGaming/Swarmtunes-client)                | [MIT](https://github.com/AceandGaming/Swarmtunes-client/blob/main/LICENSE)                                        |
| [Rclone](https://github.com/rclone/rclone)                                     | [MIT](https://github.com/rclone/rclone/blob/master/COPYING)                                                       |

## License

Unofficial Neuro KAR Downloader codebase is licensed under [MIT License](https://github.com/InfornoFire/unofficial-neuro-kar-manager/blob/main/LICENSE)

Images, photographs, and other visual assets in this repository are the property of their respective copyright holders (`All rights reserved`)
