
<h1 align="center" id="title">🛒 ShopVault — IDOR Bug Bounty Labs</h1>

<p align="center"><img width=200 height=200 src="/public/kilroywashere.jpg" alt="project-image"></p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4.x-blue" alt="Express">
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38bdf8" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
  <img src="https://img.shields.io/badge/Challenges-7-red" alt="Challenges">
</p>

---

A realistic **e-commerce web application** intentionally vulnerable to **IDOR (Insecure Direct Object Reference)** attacks. Explore features like shopping, support tickets, file sharing, and account settings — each hiding a unique IDOR vulnerability.

---

## 🚀 Quick Start

```bash
npm install
node app.js
```

Visit: **http://localhost:3000**

---

## 🔐 Test Credentials

| Username | Password | Role |
|----------|----------|------|
| `alice` | `password123` | User |
| `bob` | `password123` | User |
| `charlie` | `password123` | User |
| `admin` | `admin2024!` | Admin |

---

## 🎯 Challenges (7 IDOR Scenarios)

| # | Challenge | Difficulty | Type | Technique |
|---|-----------|------------|------|-----------|
| 1 | **Read Other Users' Orders** | 🟢 Easy | Read IDOR | URL Parameter |
| 2 | **Delete Other Users' Addresses** | 🟡 Medium | Write IDOR | Body Parameter |
| 3 | **Download Private Attachments** | 🔴 Hard | Read IDOR | Sequential IDs |
| 4 | **Hijack Notification Settings** | 🟡 Medium | Write IDOR | Body Parameter |
| 5 | **Checkout with Another User's Address** | 🔴 Hard | Hidden Body IDOR | JSON Body |
| 6 | **GUID Leak & File Access Chain** | 🔴 Hard | Info Leak + IDOR | GUID Prediction |
| 7 | **Content-Type Bypass (JSON vs Form)** | 🔴 Hard | Auth Bypass + IDOR | Content-Type Switch |



## 🏪 App Features (Where to Look)

| Feature | Route | Challenge # |
|---------|-------|-------------|
| 📦 Order Tracking | `/orders` | #1 |
| 👤 Profile & Addresses | `/profile` | #2 |
| 🎫 Support Tickets | `/tickets` | #3 |
| 🔔 Notification Settings | `/subscriptions` | #4 |
| 🛍️ Product Shop & Checkout | `/shop` | #5 |
| 📁 Shared Files & Comments | `/files` | #6 |
| ⚙️ Account Settings | `/settings` | #7 |
| 🎯 Submit Flags | `/challenges` | All |

---

## 🛠️ Tools for Testing

| Tool | Purpose |
|------|---------|
| **Browser DevTools (F12)** | Inspect network requests, run JavaScript in Console |
| **Burp Suite** | Intercept and modify HTTP requests (try changing Content-Type!) |
| **Postman** | Craft custom API requests with different headers |
| **curl** | Command-line HTTP client |

---

## 🎓 What is IDOR?

**Insecure Direct Object Reference (IDOR)** occurs when an application exposes a reference to an internal object (like a database ID) without proper authorization checks. An attacker can manipulate these references to access or modify data belonging to other users.

### Types of IDOR in this lab:

| Type | Description | Challenges |
|------|-------------|------------|
| **URL Parameter** | ID in the URL path | #1, #3, #6 |
| **Request Body** | ID in POST/PUT body | #2, #4, #5 |
| **Read IDOR** | Accessing others' data | #1, #3, #6 |
| **Write IDOR** | Modifying/deleting others' data | #2, #4, #5, #7 |
| **Information Leak** | Leaked IDs lead to IDOR | #6 |
| **Auth Bypass** | Switch Content-Type to bypass checks | #7 |

---

## 💡 IDOR Testing Tips (General)

1. **Check every ID** — URLs, forms, JSON bodies, hidden fields
2. **Use two accounts** — Compare behavior across different users
3. **Look for patterns** — Sequential, predictable, or timestamp-based IDs
4. **Try different Content-Types** — JSON, form-urlencoded, XML, multipart
5. **Monitor responses** — Leaked IDs, debug info, error messages
6. **Chain vulnerabilities** — Info leak → IDOR → privilege escalation
7. **Don't stop at 403** — Bypass techniques: change method, Content-Type, parameters
8. **Check GUIDs/UUIDs** — They might be predictable or leaked elsewhere



## ⚠️ Warning

**This application is intentionally vulnerable!**  
- Do **NOT** deploy to production
- Do **NOT** expose to the internet
- Use only on **localhost** for educational purposes
- Contains hardcoded credentials and unprotected routes

---

## 📚 Learning Resources

- [OWASP: IDOR](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References)
- [PortSwigger: IDOR](https://portswigger.net/web-security/access-control/idor)
- [HackerOne: IDOR Reports](https://hackerone.com/hacktivity?query=idor)

---

## 📄 License

MIT — Free to use for learning and teaching.

---

## 🏴‍☠️ Happy Hunting!

> "Every ID you see is a potential vulnerability. Check ownership. Always."
> 
> "Don't trust the Content-Type. Don't trust the GUID. Verify everything server-side."

---

## Author
**cyberjson**

- Instagram: [m0x_mw4_d](https://instagram.com/m0x_mw4_d)
- X (Twitter): [@m0x_mw4_d](https://x.com/m0x_mw4_d)
