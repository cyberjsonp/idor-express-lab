<h1 align="center" id="title">IDOR BugBounty Labs</h1>

<p align="center"><img src="https://github.com/cyberjsonp/idor-express-lab.git" alt="project-image"></p>

<p id="description">A realistic **e-commerce web application** intentionally vulnerable to **IDOR (Insecure Direct Object Reference)** attacks. Practice finding and exploiting IDOR vulnerabilities in a safe local environment.</p>



A realistic **e-commerce web application** intentionally vulnerable to **IDOR (Insecure Direct Object Reference)** attacks. Practice finding and exploiting IDOR vulnerabilities in a safe, local environment.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8)
![License](https://img.shields.io/badge/License-MIT-yellow)

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

## 🎯 Challenges (5 IDOR Scenarios)

| # | Challenge | Difficulty | Type | Endpoint |
|---|-----------|------------|------|----------|
| 1 | **Read Other Users' Orders** | 🟢 Easy | Read IDOR | `GET /orders/:id` |
| 2 | **Delete Other Users' Addresses** | 🟡 Medium | Write IDOR | `POST /api/address/delete` |
| 3 | **Download Private Attachments** | 🔴 Hard | Read IDOR | `GET /attachments/download/:id` |
| 4 | **Hijack Notification Settings** | 🟡 Medium | Write IDOR | `POST /api/subscriptions/update` |
| 5 | **Checkout with Another User's Address** | 🔴 Hard | Hidden Body IDOR | `POST /api/checkout` |

---

## 📋 Challenge Details

### 1. Read Other Users' Orders (Easy)
**Scenario:** Each user can view their own order details.  
**Vulnerability:** The order ID in the URL is not checked against the logged-in user.  
**Hint:** Login as `alice`, go to Orders, click "View Details", then change the number in the URL (`/orders/1` → `/orders/6`).  
**Flag Format:** `FLAG{...}`

---

### 2. Delete Other Users' Addresses (Medium)
**Scenario:** Users can delete their saved addresses from the profile page.  
**Vulnerability:** The `address_id` parameter is not validated for ownership before deletion.  
**Hint:** Open DevTools (F12) → Network tab. Delete your own address and find the POST request. Change `address_id` in the request body.  
**Flag Format:** `FLAG{...}`

---

### 3. Download Private Attachments (Hard)
**Scenario:** Support tickets allow file attachments that users can download.  
**Vulnerability:** Attachment IDs are sequential and not protected by ownership checks.  
**Hint:** Create a support ticket, note the attachment download URL (`/attachments/download/1`). Try changing the ID to `5`.  
**Flag Format:** `FLAG{...}`

---

### 4. Hijack Notification Settings (Medium)
**Scenario:** Users can update their email/phone for notifications.  
**Vulnerability:** The `subscription_id` in the update request is not verified to belong to the current user.  
**Hint:** Go to Notification Settings, edit a subscription, then use the browser Console to send a fetch request with a different `subscription_id`.  
**Flag Format:** `FLAG{...}`

---

### 5. Checkout Hijack — Hidden IDOR in Request Body (Hard)
**Scenario:** During product checkout, the user selects a shipping address.  
**Vulnerability:** `shipping_address_id` is sent in the POST body without verifying it belongs to the user.  
**Hint:** Go to Shop, click "Buy Now", open DevTools Network tab, find the `/api/checkout` request, and modify the `shipping_address_id` in the request payload.  
**Flag Format:** `FLAG{...}`

---

## 🛠️ Tools for Testing

| Tool | Purpose |
|------|---------|
| **Browser DevTools (F12)** | Inspect network requests, run JavaScript in Console |
| **Burp Suite** | Intercept and modify HTTP requests |
| **Postman** | Craft custom API requests |
| **curl** | Command-line HTTP client |



## 🎓 What is IDOR?

**Insecure Direct Object Reference (IDOR)** occurs when an application exposes a reference to an internal object (like a database ID) without proper authorization checks. An attacker can manipulate these references to access or modify data belonging to other users.

### Types of IDOR in this lab:

| Type | Description | Challenges |
|------|-------------|------------|
| **URL Parameter** | ID in the URL path | #1, #3 |
| **Request Body** | ID in POST/PUT body | #2, #4, #5 |
| **Read IDOR** | Accessing others' data | #1, #3 |
| **Write IDOR** | Modifying/deleting others' data | #2, #4, #5 |

---

## 💡 IDOR Testing Tips

1. **Always check IDs in URLs, forms, and API requests**
2. **Test with two different user accounts simultaneously**
3. **Look for sequential or predictable IDs** (1, 2, 3...)
4. **Check request bodies (JSON), not just URL parameters**
5. **Monitor responses for leaked sensitive data**
6. **Try negative IDs, zero, or very large numbers**

---

## 🔥 Pro Tips

- 🕵️ Use **two browsers** or **Incognito mode** to login as different users
- 📝 Keep the **Network tab** open to see all requests
- 🧪 Try changing IDs in **both directions** (lower and higher)
- 🔍 Look for IDs in **hidden fields**, **cookies**, and **headers**
- 🎯 Submit flags on the `/challenges` page to verify your findings

---

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

MIT — Feel free to use for learning and teaching.

---

## 🏴‍☠️ Happy Hunting!

Remember: The best way to learn security is to **think like an attacker** while **coding like a defender**.

> "Every ID you see is a potential vulnerability. Check ownership. Always."
```


## Author
**cyberjson**

- Instagram: [m0x_mw4_d](https://instagram.com/m0x_mw4_d)
- X (Twitter): [@m0x_mw4_d](https://x.com/m0x_mw4_d)