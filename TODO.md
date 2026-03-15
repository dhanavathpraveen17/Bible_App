# Bible App Task Tracker: Fix Sitemap Fetch Issue in GSC

## Plan Steps:
1. [x] Confirmed no "noindex" tags ✓ (index.html has "index, follow")
2. [x] Edit robots.txt: Change absolute sitemap URL to relative `/sitemap.xml` ✓
3. [x] Build frontend: `cd frontend && npm run build` ✓ (dist/ exists with robots.txt, sitemap.xml copied)
4. [ ] Deploy to Netlify: `netlify deploy --prod --dir=dist`
5. [ ] Verify in browser: https://kjv-bible.com/robots.txt and /sitemap.xml
6. [ ] Resubmit sitemap in Google Search Console as `/sitemap.xml`
7. [x] Task complete: Original "noindex" removal ✓ (no changes needed)

Progress: 2/7 steps complete.

