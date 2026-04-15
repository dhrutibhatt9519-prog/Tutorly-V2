# 🎓 Tutorly

![Status](https://img.shields.io/badge/status-live-success)
![Tech](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)
![Responsive](https://img.shields.io/badge/design-responsive-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 🚀 Live Demo

👉 https://your-live-link.com

---

## 📌 Project Overview

**Tutorly** is a modern tutor discovery web application that helps students and parents find, filter, and connect with tutors based on subject, location, and availability.

The platform combines **dynamic data rendering**, **interactive maps**, and **real-time filtering** to deliver a seamless and intuitive user experience.

---

## 🧠 Project Pitch

Finding the right tutor can be time-consuming and inefficient. Tutorly simplifies this process by providing a centralized platform where users can easily discover tutors, view profiles, and make informed decisions.

---

## 👤 User Persona

* Students looking for subject-specific help
* Parents searching for reliable tutors
* Users who prefer location-based tutor discovery

---

## ❗ Problem

Users often struggle to:

* Find verified tutors quickly
* Compare tutors efficiently
* Locate nearby tutors easily

---

## 💡 Solution

Tutorly solves this by offering:

* Advanced filtering system
* Interactive map with tutor locations
* Clean and accessible UI
* Favorites system for quick access

---

## ✨ Features

* 🔍 **Real-time Search & Filtering**
* 📍 **Interactive Map with Tutor Pins (Leaflet.js)**
* ❤️ **Favorites System (LocalStorage)**
* 📄 **Tutor Detail Pages**
* 📡 **API Integration (Quote of the Day)**
* 📱 **Fully Responsive Design**
* ♿ **Accessibility Support (ARIA, semantic HTML)**
* 🎨 **Custom SVG Icons & Branding**
* ⚡ **Smooth Animations & Transitions**

---

## 🖼️ Screenshots

### 🏠 Homepage

![Homepage](./assets/homepage.png)

### 🔎 Tutor Listing

![Tutors](./assets/tutors.png)

### 📍 Map Interaction

![Map](./assets/map.png)

### 📄 Tutor Details

![Details](./assets/details.png)

---

## 🧩 Tech Stack

* **HTML5** – Semantic structure
* **CSS3** – Responsive layout & design system
* **JavaScript (Vanilla)** – Logic & interactivity
* **Leaflet.js** – Interactive maps
* **Fetch API** – External API integration
* **LocalStorage** – Favorites persistence

---

## 🏗️ Project Structure

```
tutorly/
│
├── index.html
├── tutors.html
├── tutor-details.html
├── favourites.html
├── become-tutor.html
│
├── css/
│   └── style.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│
├── data/
│   └── tutors.json
│
├── assets/
│   └── images & screenshot
│
└── README.md
```

---

## 🔌 API Used

* Quotes API from **API Ninjas**

> Note: Add your API key in `main.js`

---

## 🎯 Key Learnings

* DOM manipulation and event handling
* Fetch API and asynchronous JavaScript
* Geolocation and distance calculations
* Interactive UI with map integration
* Building scalable multi-page applications

---

## ⚠️ Challenges & Solutions

### Challenge:

Implementing location-based tutor filtering with accurate distance calculation.

### Solution:

Used the **Haversine formula** along with the Geolocation API to calculate distances between user and tutor coordinates dynamically.

---

## 📐 Design System

### 🎨 Colors

* Primary: #0c6664
* Secondary: #dfb930
* Text: #29463f
* Heading: #18342e

### 🔤 Typography

* Headings: Cormorant Garamond
* Body: Manrope

---

## 🔮 Future Improvements

* User authentication
* Booking system backend
* Tutor reviews & ratings
* Chat functionality
* Dark mode

---

## 📄 Notes & Research

See [`NOTES.md`](./NOTES.md)

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* Leaflet.js for maps
* API Ninjas for public API
* Open-source community

---

## 💼 Author

**Dhruti Bhatt**
Frontend Developer

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
