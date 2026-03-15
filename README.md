# Unofficial Neuro Karaoke Archive Downloader

A simple web app to download the Unofficial Neuro Karaoke Archive.

The name "Unofficial Neuro KAR" derives itself as a play-on of **Kar**aoke **Ar**chive.

Huge thank you to [Swarmtunes](https://swarmtunes.com/) for helping!

## Requirements

- [pnpm](https://pnpm.io/)

    ```bash
    pnpm install
    ```

- VSCode Extensions can be found in `.vscode/extensions.json`

### GDrive API

The site uses a OAuth2 Client for users to download the drive with. This has no scope within the application and is simply used for Google's API to register the downloads under.

To create your own public API key (for your own site):

1. Go to console.cloud.google.com and create a new project

2. Go to APIs & Services

3. Enable -> Google Drive API

4. OAuth Client Services

    i. Setup (fill in) -> External

    ii. Audience -> Ensure your account is under Test Users

5. Credentials -> Create -> Web App -> Download JSON -> `credentials.json`

6. Add the client ID to `src/api/drive.ts`

## Usage & Running

```bash
pnpm run dev
```

The site can be visited from `http://localhost:5173/unofficial-neuro-kar-downloader/`.

## Open Source Software

Neuro Unofficial Archive Downloader would not be possible without the following open source software:

| Software                                                                       | License                                                                                                           |
|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| [Swarmtunes](https://github.com/AceandGaming/Swarmtunes-client)                | [MIT](https://github.com/AceandGaming/Swarmtunes-client/blob/main/LICENSE)                                        |
| [Rclone](https://github.com/rclone/rclone)                                     | [MIT](https://github.com/rclone/rclone/blob/master/COPYING)                                                       |

## License

Unofficial Neuro KAR Downloader codebase is licensed under [MIT License](https://github.com/InfornoFire/unofficial-neuro-kar-manager/blob/main/LICENSE)

Images, photographs, and other visual assets in this repository are the property of their respective copyright holders (`All rights reserved`)
