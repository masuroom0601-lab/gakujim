# Deployment Guide

## Overview

This guide covers how to deploy the Random Joke Generator to various platforms.

## 1. GitHub Pages (Easiest)

### Step 1: Push to GitHub

```bash
git add projects/joke-generator/
git commit -m "Deploy joke generator to GitHub Pages"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to repository settings: `Settings → Pages`
2. Select source:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)` or `/projects/joke-generator` depending on your structure
3. Save
4. Your site will be live at: `https://masuroom0601-lab.github.io/gakujim/projects/joke-generator/`

### Step 3: Update Links

If you moved files, update any internal links in HTML files.

---

## 2. Netlify

### Method A: Drag & Drop

1. Visit [Netlify](https://netlify.com)
2. Sign in or create account
3. Drag and drop the `projects/joke-generator` folder
4. Your site is deployed!

### Method B: GitHub Integration

1. Connect your GitHub repository
2. Select build settings:
   - Repository: `gakujim`
   - Branch: `main`
   - Build command: (leave empty for static files)
   - Publish directory: `projects/joke-generator`
3. Deploy

### Custom Domain

1. Go to `Site settings → Domain management`
2. Add custom domain or configure CNAME

---

## 3. Vercel

### Step 1: Create Vercel Account

Visit [Vercel](https://vercel.com) and sign up with GitHub.

### Step 2: Import Project

1. Click "New Project"
2. Select your `gakujim` repository
3. Configure:
   - Framework: `Other` (static)
   - Root Directory: `projects/joke-generator`
4. Click "Deploy"

### Step 3: Custom Domain (Optional)

Go to project settings and add a custom domain.

---

## 4. Firebase Hosting

### Prerequisites

```bash
npm install -g firebase-tools
firebase login
```

### Setup

```bash
cd projects/joke-generator
firebase init hosting
```

Choose options:
- Hosting directory: `.` (current)
- Configure as single-page app: `No`
- Set rewrites: `No`

### Deploy

```bash
firebase deploy
```

Your site will be live at: `https://your-project.web.app`

---

## 5. AWS S3 + CloudFront

### Step 1: Create S3 Bucket

```bash
aws s3 mb s3://joke-generator-bucket
```

### Step 2: Upload Files

```bash
aws s3 sync projects/joke-generator/ s3://joke-generator-bucket/ --acl public-read
```

### Step 3: Enable Static Website Hosting

```bash
aws s3 website s3://joke-generator-bucket/ \
  --index-document index.html \
  --error-document index.html
```

### Step 4: Create CloudFront Distribution

Use AWS Console to create a CloudFront distribution pointing to your S3 bucket.

---

## 6. Docker Deployment

Create a `Dockerfile` in the project root:

```dockerfile
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY . .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t joke-generator .
docker run -p 8080:80 joke-generator
```

Visit: `http://localhost:8080`

---

## 7. Local Server Testing

Before deploying, test locally:

### Python 3
```bash
cd projects/joke-generator
python -m http.server 8000
# Visit: http://localhost:8000
```

### Python 2
```bash
python -m SimpleHTTPServer 8000
```

### Node.js (http-server)
```bash
npx http-server projects/joke-generator -p 8000
```

### Live Server (VS Code Extension)
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## Environment Variables

Currently, this project doesn't require environment variables. The API endpoint is hardcoded:

```javascript
const API_BASE_URL = 'https://v2.jokeapi.dev/joke';
```

To make it configurable:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://v2.jokeapi.dev/joke';
```

---

## SSL/HTTPS

Most hosting platforms automatically provide SSL certificates:

- ✅ GitHub Pages: Automatic HTTPS
- ✅ Netlify: Automatic HTTPS
- ✅ Vercel: Automatic HTTPS
- ✅ Firebase: Automatic HTTPS
- ⚠️ AWS S3: Requires CloudFront for HTTPS

---

## Performance Optimization

### Minification

Minify CSS and JavaScript before deployment:

```bash
# Using UglifyJS (or similar tool)
uglifyjs script.js -o script.min.js
```

Update references in `index.html`:
```html
<script src="script.min.js"></script>
```

### Caching Headers

Set appropriate cache headers in your hosting provider:

```
Content-Type: text/html → Cache-Control: max-age=3600
Content-Type: text/css → Cache-Control: max-age=31536000
Content-Type: application/javascript → Cache-Control: max-age=31536000
```

### CDN Integration

Use a CDN like Cloudflare for better performance:

1. Sign up at [Cloudflare](https://cloudflare.com)
2. Add your domain
3. Update nameservers
4. Enable caching rules

---

## Monitoring & Analytics

### Google Analytics

Add to `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://www.pingdom.com)
- [StatusPage](https://www.statuspage.io)

---

## Troubleshooting

### Issue: 404 on Refresh
**Solution**: Configure server to serve `index.html` for all routes

### Issue: CORS Errors
**Solution**: JokeAPI has public CORS enabled, so no issue expected

### Issue: Slow Load Times
**Solution**: Enable caching, use CDN, minify assets

### Issue: Mobile Layout Issues
**Solution**: Test on various devices using browser DevTools

---

## Production Checklist

- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify API calls work
- [ ] Check all links and buttons
- [ ] Test keyboard navigation
- [ ] Verify dark mode
- [ ] Check console for errors
- [ ] Optimize images (if any)
- [ ] Minify CSS/JS
- [ ] Set appropriate cache headers
- [ ] Add analytics
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Create deployment documentation

---

## Rollback

If issues occur post-deployment:

### GitHub Pages
```bash
git revert <commit-hash>
git push origin main
```

### Netlify
1. Go to "Deploys"
2. Select previous deployment
3. Click "Publish deploy"

### Vercel
1. Go to "Deployments"
2. Click the previous deployment
3. Click "Promote to Production"

---

## Resources

- [JokeAPI Documentation](https://jokeapi.dev)
- [Netlify Deployment](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [GitHub Pages](https://pages.github.com)

---

**Happy deploying! 🚀**