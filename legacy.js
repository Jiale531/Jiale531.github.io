// Preserve existing bookmarks, including the ten evidence anchors.
(() => {
  const id = new URLSearchParams(location.search).get('project');
  const pages = {lensfocus:'lensfocus.html',office:'zhangshangbang.html'};
  if (Object.prototype.hasOwnProperty.call(pages,id)) location.replace(pages[id]+location.hash);
})();
