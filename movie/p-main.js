// p-main.js
const apiKey = "dc340e81a2bdef1a7bcb0b31358487fd";
const imageBase = "https://image.tmdb.org/t/p/w500";
const backdropBase = "https://image.tmdb.org/t/p/w1280";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchButton");
const htmlOutput = document.getElementById("htmlOutput");
const postTitle = document.getElementById("postTitle");
const customIdInput = document.getElementById("customIdInput");

// Botón de búsqueda
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) {
    alert("Por favor ingresa un ID o título de película.");
    return;
  }

  if (/^\d+$/.test(query)) {
    fetchMovieById(query);
  } else {
    fetchMovieByTitle(query);
  }
});

// Buscar por ID
function fetchMovieById(id) {
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es-ES&append_to_response=videos`)
    .then(res => res.json())
    .then(movie => generateHtml(movie))
    .catch(() => alert("❌ No se encontró la película con ese ID."));
}

// Buscar por título
function fetchMovieByTitle(title) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) {
        alert("❌ No se encontraron películas con ese título.");
        return;
      }
      const movie = data.results[0];
      fetchMovieById(movie.id);
    })
    .catch(() => alert("❌ Error buscando la película."));
}

// Generar HTML completo para Blogger
function generateHtml(movie) {
  const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  const genres = movie.genres ? movie.genres.map(g => g.name).join(", ") : "N/A";
  const customId = customIdInput.value.trim();

  if (!customId) {
    alert("⚠️ Ingresa un Custom ID para los enlaces de streaming.");
    return;
  }

  const trailer = movie.videos && movie.videos.results.length > 0
    ? `https://www.youtube.com/embed/${movie.videos.results[0].key}`
    : "";

  const posterUrl = imageBase + movie.poster_path;
  const backdropUrl = backdropBase + movie.backdrop_path;

  const html = `
<!-- ${movie.title} - ${year} -->
<!-- GÉNEROS/ETIQUETAS: ${genres}, ${year} -->
<!-- ${backdropUrl} image/jpeg -->
[stt/Película]
[hd/Latino]
[sc/${movie.vote_average}]
<span><!--more--></span>
<img alt="${movie.title}" src="${posterUrl}" style="display: none;" />
<p>
[ss]
[Trailer;${trailer}]
[/ss]
[nd]
${movie.overview}
[/nd]
<id>
[br/Ver ahora]
[Opción 1|https://streaming.cinedom.pro/api/movie/${customId} image/jpeg|${posterUrl}]
[Opción 2|https://vidsrc.pro/embed/movie/${customId} image/jpeg|${posterUrl}]
[Opción 3|https://vidsrc.xyz/embed/movie/${customId} image/jpeg|${posterUrl}]
[Opción 4|https://telaflixapi.com/e/movie?tmdb=${customId} image/jpeg|${posterUrl}]
[Opción 5|https://embedder.net/e/movie?tmdb=${customId} image/jpeg|${posterUrl}]
[Opción 6|https://moviesapi.club/movie/${customId} image/jpeg|${posterUrl}]
</id>
`;

  htmlOutput.value = html;
  postTitle.value = movie.title;
}
