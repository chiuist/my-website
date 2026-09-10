// DMG 是已 Developer ID 签名并通过 Apple 公证的官网版；App Store 链接在商店审核通过后可直接使用。
const downloadLinks = Object.freeze({
  dmg: 'https://s-calendar.chiuist.com/downloads/Simply-Calendar-Direct-1.5.dmg',
  appStore: 'https://apps.apple.com/us/app/%E6%97%A5%E5%8E%86%E5%8D%B3%E6%97%A5%E5%8E%86/id6808212741'
});
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
