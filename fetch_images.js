const fs = require('fs');

async function fetchWikiImage(title, outName) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&format=json&pithumbsize=800`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const imageUrl = pages[pageId]?.thumbnail?.source;
    if (imageUrl) {
      const imgRes = await fetch(imageUrl);
      const buffer = await imgRes.arrayBuffer();
      fs.writeFileSync(`public/images/scenarios/${outName}.png`, Buffer.from(buffer));
      console.log('Saved', outName);
    } else {
      console.log('No image for', title);
    }
  } catch (e) { console.error(e); }
}

async function main() {
  await fetchWikiImage('Jacket', 'patagonia');
}
main();
