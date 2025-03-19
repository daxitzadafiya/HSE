import axios from "axios";
export function downloadFile(url, filename) {
  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  axios({
    url: url,
    method: 'GET',
    responseType: 'blob',
  }).then((response) => {
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = filename;
    link.click();
  });
}
