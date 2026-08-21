# 🌿 Plant Identifier

A responsive web application that identifies plants from uploaded images and provides useful botanical information about the identified plant.

## ✨ Features

* 📷 Upload plant images in JPG, JPEG, PNG, or WEBP format
* 🌿 Identify plants using the Pl@ntNet API
* 🔬 Retrieve botanical and taxonomic information using GBIF
* 📊 Display identification confidence
* 🌱 Show plant family information
* 🌿 Display genus
* 🌸 Display order
* 🍃 Display class
* 🌍 Display kingdom
* ✅ Display taxonomic status
* 🖼️ Preview the uploaded image before identification
* 🔄 Identify another plant without refreshing the page
* 📥 Download identification results as a PDF report
* 🌙 Dark mode support
* 📱 Responsive design for desktop and mobile devices

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript
* Pl@ntNet API
* GBIF API
* jsPDF
* Git & GitHub

## 🔌 APIs Used

### Pl@ntNet API

Pl@ntNet is used to identify the plant from the uploaded image.

The application sends the selected plant image to the API and receives possible plant identifications along with confidence scores.

### GBIF API

GBIF is used to retrieve additional taxonomic information about the identified plant, including:

* Common Name
* Scientific Name
* Genus
* Family
* Order
* Class
* Kingdom
* Taxonomic Status

## 📱 Responsive Design

The website is designed to work across different screen sizes.

It has been tested for:

* 💻 Desktop
* 📱 Mobile
* 📲 Tablet-sized screens

The result section, plant information, buttons, and uploaded images adapt to smaller screens.

## 📥 PDF Report

After identifying a plant, users can download a PDF report containing the available identification information.

The report includes:

* Plant name
* Scientific name
* Identification confidence
* Family
* Taxonomic information

## 🚀 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/plant-identifier.git
```

### 2. Open the project

```bash
cd plant-identifier
```

### 3. Install dependencies

If your project uses a Node.js server, install the required packages:

```bash
npm install
```

### 4. Configure API credentials

Create an `.env` file if your project requires environment variables.

**Never upload your `.env` file to GitHub.**

Example:

```env
PLANTNET_API_KEY=your_api_key_here
```

### 5. Start the server

Use the start command configured in your project, for example:

```bash
node server.js
```

Then open the local address shown by your server in the browser.

## 📂 Project Structure

```text
plant-identifier/
│
├── assets/
│   └── project assets
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── server/
│   └── server files
│
├── index.html
├── server.js
├── .gitignore
└── README.md
```

## 🎯 Project Purpose

The purpose of this project is to create a simple and user-friendly plant identification experience.

Instead of requiring users to know the plant name beforehand, they can upload an image and receive identification and botanical information through a clean web interface.

## 🔮 Future Improvements

Possible future improvements include:

* 🌱 Plant care recommendations
* 💧 Watering information
* ☀️ Sunlight requirements
* 🌡️ Temperature information
* 📚 Plant history and additional descriptions
* 🗂️ Identification history
* ⭐ Save favorite plants
* 🗺️ Habitat information

## 👨‍💻 Author

**Nitish Kumar Jha**

Built with 🌱 HTML, CSS and JavaScript.

---

⭐ If you find this project useful, consider giving the repository a star!
