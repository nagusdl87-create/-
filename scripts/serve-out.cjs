// 테스트용 정적 서버: node scripts/serve-out.cjs [out] [5000]. Firebase cleanUrls와 같게 /a → /a.html.
// npx serve는 반복 테스트 중 파일을 너무 많이 열어 멈추고(EMFILE), 그때 화면 불일치 오류(#418)가 가짜로 났다. 이 서버를 쓴다.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(process.argv[2] || 'out'), PORT = +(process.argv[3] || 5000);
const T = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  const tries = [p, p + '.html', path.join(p, 'index.html')];
  for (const t of tries) {
    const f = path.join(ROOT, t);
    if (!f.startsWith(ROOT)) break;
    try {
      if (fs.statSync(f).isFile()) {
        const body = fs.readFileSync(f);
        res.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream', 'Cache-Control': t.startsWith('/_next/static') ? 'public, max-age=31536000, immutable' : 'no-cache' });
        return res.end(body);
      }
    } catch { }
  }
  const nf = path.join(ROOT, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'not found');
}).listen(PORT, () => console.log('listening', PORT, ROOT));
