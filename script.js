// ========= CONFIG =========
const API_KEY = "3d60cc65653e0dd1105b5f7aa285b0c4";
let movieHistory = [];
const BASE_URL = "https://api.themoviedb.org/3";

let currentMovie = null; // Currently displayed movie

// ========= INITIALIZE SLIDERS WITH DEFAULT VALUES =========
window.addEventListener("DOMContentLoaded", () => {
    const yearSlider = document.getElementById("release-year");
    const ratingSlider = document.getElementById("rating");

    yearSlider.value = 2020;
    document.getElementById("release-year-value").textContent = "2020";

    ratingSlider.value = 5;
    document.getElementById("rating-value").textContent = "5.0";
});

// ========= UI ACTIONS =========
function myHistory() {
    const section = document.getElementById("history-section");

    section.style.removeProperty("display");   
    section.style.display = "block";           
    section.style.opacity = "1";

    section.scrollIntoView({ behavior: "smooth" });
}

function myAbout() {
    document.getElementById("section-footer").scrollIntoView({ behavior: "smooth" });
}

// Update release year display on slider move
document.getElementById("release-year").addEventListener("input", function() {
    document.getElementById("release-year-value").textContent = this.value;
});

// Update rating display on slider move 
document.getElementById("rating").addEventListener("input", function() {
    document.getElementById("rating-value").textContent = this.value;
});

// ========= MAIN GENERATOR =========
async function myGenerate() {
    document.getElementById("release-year").dispatchEvent(new Event("input"));
    document.getElementById("rating").dispatchEvent(new Event("input"));
    const year = document.getElementById("release-year").value;
    const genre = document.getElementById("genre").value;
    const rating = document.getElementById("rating").value;

    // Update displayed values
    document.getElementById("release-year-value").textContent = year;
    document.getElementById("rating-value").textContent = rating;

    const genreId = mapGenreToTMDB(genre);

    // Create request parameters
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${randomPage()}&primary_release_year=${year}&vote_average.gte=${rating}`;

    if (genreId) url += `&with_genres=${genreId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showMovieError("No movies found. Try different filters!");
            return;
        }

        // Random movie from results
        const movie = data.results[Math.floor(Math.random() * data.results.length)];

        currentMovie = movie;
        displayMovie(movie);
        document.querySelector(".movie-suggestion-section").style.display = "block";

        saveToHistory(movie);

        const historySection = document.getElementById("history-section");
        document.getElementById("history-section").style.display = "block";

    } catch (error) {
        console.error(error);
        showMovieError("Error fetching movie. Check API key or network.");
    }

    document.querySelector(".movie-suggestion-section")
        .scrollIntoView({ behavior: "smooth" });
}

// ========= LOAD TRAILER =========
async function loadTrailer(movieId) {
    try {
        const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        // Ищем лучший трейлер
        const trailer = data.results.find(v =>
            v.type === "Trailer" &&
            v.site === "YouTube" &&
            v.official === true
        );

        if (trailer) {
            return trailer.key;
        }

        // fallback: любой YouTube трейлер
        const anyVideo = data.results.find(v => v.site === "YouTube");

        return anyVideo ? anyVideo.key : null;

    } catch (err) {
        console.error(err);
        return null;
    }
}

// ========= CLICK ON MOVIE CARD =========
document.getElementById("movie-card").onclick = async () => {
    if (!currentMovie) return;

    const trailerKey = await loadTrailer(currentMovie.id);

    if (trailerKey) {
        // открываем YouTube напрямую (без iframe)
        window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    } else {
        // fallback — поиск
        window.open(`https://www.youtube.com/results?search_query=${currentMovie.title} trailer`, "_blank");
    }
};

// ========= DISPLAY MOVIE =========
function displayMovie(movie) {
    const title = document.getElementById("movie-title");
    const details = document.getElementById("movie-details");
    const description = document.getElementById("movie-description");
    const poster = document.getElementById("movie-poster");

    title.textContent = movie.title;
    details.textContent = `Release Year: ${movie.release_date?.slice(0, 4) || "N/A"} | Rating: ${movie.vote_average}`;
    description.textContent = movie.overview || "No description available.";

    if (movie.poster_path) {
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.style.display = "block";
    } else {
        poster.style.display = "none";
    }
}

function showMovieError(msg) {
    document.getElementById("movie-title").textContent = "⚠ Error";
    document.getElementById("movie-details").textContent = msg;
    document.getElementById("movie-description").textContent = "";
}

// ========= HISTORY =========
function saveToHistory(movie) {
    const historyList = document.getElementById("history-list");

    const text = `${movie.title} (${movie.release_date?.slice(0, 4)}) — ⭐ ${movie.vote_average}`;

    movieHistory.unshift(text);

    localStorage.setItem("movieHistory", JSON.stringify(movieHistory));

    const li = document.createElement("li");
    li.textContent = text;
    historyList.prepend(li);
}

// ========= LOAD HISTORY ON PAGE LOAD =========
window.addEventListener("DOMContentLoaded", () => {
    const saved = JSON.parse(localStorage.getItem("movieHistory")) || [];

    movieHistory = saved;

    const historyList = document.getElementById("history-list");

    saved.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });

    if (saved.length > 0) {
        document.getElementById("history-section").style.display = "block";
    }
});

// ========= СLEAR HISTORY & DOWNLOAD HISTORY =========
function clearHistory() {
    movieHistory = [];
    localStorage.removeItem("movieHistory");
    document.getElementById("history-list").innerHTML = "";
}

function downloadHistory() {
    const json = JSON.stringify(movieHistory, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "movieHistory.json";
    a.click();

    URL.revokeObjectURL(url);
}


// ========= HELPERS =========
function mapGenreToTMDB(g) {
    const map = {
        "action": 28,
        "comedy": 35,
        "drama": 18,
        "horror": 27,
        "sci-fi": 878,
        "romance": 10749,
        "documentary": 99,
        "thriller": 53,
        "animation": 16,
        "fantasy": 14,
        "mystery": 9648,
        "adventure": 12,
        "crime": 80,
        "biography": 36,
        "family": 10751
    };
    return map[g] || null;
}

function randomPage() {
    return Math.floor(Math.random() * 50) + 1;
}

// ==== DEFAULT FILTER VALUES ON PAGE LOAD ====
window.addEventListener("DOMContentLoaded", () => {
    const yearSlider = document.getElementById("release-year");
    const yearValue = document.getElementById("release-year-value");

    const ratingSlider = document.getElementById("rating");
    const ratingValue = document.getElementById("rating-value");

    yearSlider.value = 2020;
    yearValue.textContent = 2020;

    ratingSlider.value = 5;
    ratingValue.textContent = Number(5).toFixed(1);
});