import { ARCHIVE_FOLDER_ID } from "./drive";

let gapiPickerLoaded = false;

async function loadGapiPicker(): Promise<void> {
  if (gapiPickerLoaded) return;
  return new Promise<void>((resolve, reject) => {
    const load = () =>
      gapi.load("picker", () => {
        gapiPickerLoaded = true;
        resolve();
      });
    if (typeof gapi !== "undefined") {
      load();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = load;
    script.onerror = () =>
      reject(new Error("Failed to load Google Picker API"));
    document.head.appendChild(script);
  });
}

export async function openArchiveFolderPicker(token: string): Promise<void> {
  await loadGapiPicker();
  return new Promise((resolve, reject) => {
    const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(true);
    view.setParent(ARCHIVE_FOLDER_ID);

    let picker: google.picker.Picker;
    picker = new google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(token)
      .setTitle("Open the Neuro Karaoke Archive folder to grant access")
      .setCallback((data: google.picker.ResponseObject) => {
        if (data.action === google.picker.Action.PICKED) {
          picker.dispose();
          resolve();
        } else if (data.action === google.picker.Action.CANCEL) {
          picker.dispose();
          reject(new Error("Folder access not granted"));
        }
      })
      .build();
    picker.setVisible(true);
  });
}
