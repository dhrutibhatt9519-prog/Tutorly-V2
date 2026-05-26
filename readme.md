# Tutorly

Tutorly is a React tutor discovery application for browsing tutors, filtering by subject/location/availability/price, viewing tutor profiles, saving favourites, and submitting contact/application forms.

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- Leaflet
- LocalStorage

## Features

- Responsive React routes for Home, Tutors, Tutor Details, Favourites, and Become a Tutor
- Real-time tutor search and filtering
- Interactive Leaflet map with tutor pins
- Persistent favourites using LocalStorage
- Reusable React components and hooks-driven state
- Styling composed with Tailwind utility classes in React components
- `src/tailwind.css` contains only Tailwind entry directives

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
```

Navigate to the project folder:

```
cd your-repo-name
```

## Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Build

```bash
npm run build
```

## 🌐 Live Demo

🚀 View the deployed project here:  
[Live Website](https://tutorly-v2.vercel.app/)

---

### Deployment

This project is deployed using [Vercel](https://vercel.com/).

## Project Structure

```text
tutorly-react/
├── assets/
│   └── tutorly_logo.png
├── data/
│   └── tutors.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── tailwind.css
├── index.html
├── tutors.html
├── tutor-details.html
├── favourites.html
├── become-tutor.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```
