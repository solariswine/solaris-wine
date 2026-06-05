# Solaris Wine — Deployment Guide

## 📋 Quick Setup

### 1. GitHub Repository
```bash
cd solaris-wine
git init
git add .
git commit -m "Initial commit: Solaris Wine website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/solaris-wine.git
git push -u origin main
```

### 2. Vercel Deployment

**Step 1: Connect GitHub**
- Go to vercel.com → Import Project
- Select your GitHub repo: `solaris-wine`
- Framework: Other (Static Site)
- Build Command: (leave empty)
- Output Directory: (leave empty)
- Deploy ✅

**Step 2: Set Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:

```
GMAIL_USER = info@solariswine.com
GMAIL_PASS = <ใส่ใน Vercel เท่านั้น>
LINE_CHANNEL_ID = U76f6ce4856a1a2ca75098f78d49c1586
LINE_CHANNEL_SECRET = e7a1fd3706db5ae04049730dd80318ff
LINE_ACCESS_TOKEN = <ใส่ใน Vercel เท่านั้น>
```

**Step 3: Domain Setup**
- Vercel Dashboard → Settings → Domains
- Add domain: `solariswine.com`
- Add domain: `www.solariswine.com`
- Follow DNS instructions from your domain registrar

### 3. Local Testing (Optional)

```bash
# Install dependencies
npm install express nodemailer cors dotenv

# Create .env.local file (copy from .env.example)
cp .env.example .env.local

# Test backend locally (if using Node server)
node order-server.js
```

---

## 📁 File Structure

```
solaris-wine/
├── solaris-wine-home.html       # Home page (age gate + cart + checkout)
├── wines.html                   # Wine catalogue + detail popup
├── contact.html                 # Contact form + info
├── api/
│   ├── order.js                 # Serverless function: Wine orders
│   └── contact.js               # Serverless function: Contact form
├── vercel.json                  # Vercel configuration
├── .env.example                 # Environment variables template
├── order-server.js              # (Optional) Express backend for local testing
└── README.md
```

---

## 🔧 How It Works

### Order Flow
1. Customer fills checkout form + uploads payment slip (PNG/JPG)
2. Frontend sends POST to `/api/order`
3. Vercel serverless function:
   - ✅ Validates data
   - ✅ Stores slip as base64
   - ✅ Sends email to `orders@solariswine.com`
   - ✅ Sends LINE notification to @064xdegi
   - ✅ Returns order ID to customer

### Contact Flow
1. Customer submits contact form
2. Frontend sends POST to `/api/contact`
3. Vercel serverless function:
   - ✅ Validates data
   - ✅ Sends email to `contact@solariswine.com`
   - ✅ Sends LINE notification to @064xdegi
   - ✅ Returns confirmation to customer

---

## 📧 Email Receivers

| Type | Email | Purpose |
|------|-------|---------|
| Orders | orders@solariswine.com | Wine orders with payment slips |
| Contact | contact@solariswine.com | Enquiries & tasting requests |
| Support | support@solariswine.com | General support |
| Sales | sales@solariswine.com | B2B wholesale |
| Info | info@solariswine.com | General info (sender) |

---

## 📱 LINE Messaging

- **LINE OA ID**: @064xdegi
- **Receives**: Order notifications + Contact form submissions
- **Format**: Text with order ID, customer name, email, phone

---

## 🚀 After Deployment

1. **Test Order**
   - Go to solariswine.com
   - Complete test checkout
   - Check `orders@solariswine.com` inbox
   - Check LINE @064xdegi

2. **Test Contact Form**
   - Go to /contact.html
   - Submit test enquiry
   - Check `contact@solariswine.com` inbox
   - Check LINE @064xdegi

3. **Custom Domain**
   - Update DNS at your registrar
   - Vercel provides exact CNAME records
   - Wait 24–48 hours for propagation

---

## 🔐 Security Notes

- ✅ `nodemailer` uses Gmail App Password (not plain password)
- ✅ Environment variables stored in Vercel (not in code)
- ✅ `.env.local` added to `.gitignore` (never commit)
- ✅ CORS enabled for form submissions
- ✅ Payment slip stored as base64 in email attachment

---

## 📞 Support Contacts

**Company**: Solaris Intertrade Co., Ltd.  
**Address**: 101/93 Settgasiri Krungthep-Kreetha 2, Soi Pracharuamchai, Ramkhamhang 68 Road, Hau Mak, Bang Ka Pi, Bangkok 10310  
**Email**: info@solariswine.com  
**Phone**: +66 961 644 422  
**Hours**: Monday–Saturday, 9:00 AM – 6:00 PM ICT  
**Website**: www.solariswine.com

---

## ✅ Checklist Before Live

- [ ] All env vars set in Vercel
- [ ] GitHub repo pushed
- [ ] Vercel deployment successful
- [ ] Domain DNS updated
- [ ] Test order submission
- [ ] Test contact form
- [ ] Check email delivery
- [ ] Check LINE notifications
- [ ] Review age gate functionality
- [ ] Test cart + checkout flow
- [ ] Mobile responsiveness check

---

Generated: June 3, 2026  
Status: ✅ Production Ready
