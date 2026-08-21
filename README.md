# 🎬 FilmForge

FilmForge is a single-page movie recommendation web application built with **HTML, CSS, and JavaScript**. It uses the **TMDB API** to generate film recommendations based on user-selected filters such as genre, release year, and rating.

The project was developed as part of my **first-year Computer Science coursework at the University of Plymouth**.

## ✨ Features

* Filter films by genre
* Filter by release year
* Filter by minimum rating
* Generate random movie recommendations
* Display film posters, descriptions, ratings, and release information
* Open official or available YouTube trailers
* Save recommendation history using `localStorage`
* Restore saved history after page reload
* Clear recommendation history
* Export recommendation history as a JSON file
* Dynamic page updates without reloading
* Error handling for failed API requests or empty results

## 🛠️ Technologies

* HTML5
* CSS3
* JavaScript
* Fetch API
* TMDB API
* Browser `localStorage`
* JSON
* DOM manipulation

## 🧠 Technical Implementation

FilmForge communicates with the TMDB API using asynchronous JavaScript and the `fetch()` API.

User-selected filters are used to build a request to the TMDB movie discovery endpoint. The application then selects a random film from the returned results and dynamically updates the page with the film title, release year, rating, description, and poster.

Trailer information is loaded through a second TMDB API request. When available, the application opens an official YouTube trailer, with a fallback to another available YouTube video.

Recommendation history is stored in the browser using `localStorage`, allowing previous results to remain available after the page is refreshed. Users can also clear their history or export it as a JSON file.

## 🔐 API Configuration

This project requires a TMDB API key.

Create a local file named:

```text
config.js
```

using the following format:

```js
const TMDB_API_KEY = "YOUR_TMDB_API_KEY";
```

The real `config.js` file is ignored by Git and should not be committed to the repository.

An example configuration file is provided as:

```text
config.example.js
```

## 🚀 Running the Project

1. Clone or download the repository.
2. Create a `config.js` file in the project root.
3. Add your TMDB API key to `config.js`.
4. Open `index.html` in a web browser.

## 📸 Screenshots

### Home Page

![Home](HomePage.png)

### Movie Recommendation

![Movie](MovieResult.png)

### Recommendation History

![History](History.png)

## 📚 What I Learned

This project helped me develop my understanding of:

* Working with external REST APIs
* Asynchronous JavaScript
* API request handling
* DOM manipulation
* Browser storage
* JSON data
* Dynamic user interfaces
* Error handling
* Client-side application state
* Structuring a small single-page web application

## 🔮 Future Improvements

Potential future improvements include:

* Improved responsive design
* Pagination and more advanced filtering
* Favourite movie lists
* Search by actor or director
* Better trailer selection
* A backend service for secure API key handling
* User accounts and cloud-synced history

## 👤 Author

**Andrii Kryulin**

Computer Science with Software Engineering student at the University of Plymouth.
