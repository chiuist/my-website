// Set these two URLs when the distribution package and App Store listing are ready.
const downloadLinks = Object.freeze({ dmg: '', appStore: '' });
const statusLine = document.getElementById('download-status');
const downloadNote = document.getElementById('download-note');
if (downloadLinks.dmg && downloadLinks.appStore) {
  downloadNote.textContent = '适用于 macOS 14 及更高版本';
}
document.querySelectorAll('[data-download]').forEach(button => {
  button.addEventListener('click', () => {
    const kind = button.dataset.download;
    const destination = downloadLinks[kind];
    if (destination) {
      window.location.assign(destination);
      return;
    }
    statusLine.textContent = kind === 'dmg'
      ? 'DMG 安装包尚未开放下载，请稍后再来。'
      : 'Mac App Store 链接即将开放，请稍后再来。';
  });
});
