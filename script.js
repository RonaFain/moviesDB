import movieDetails from './components/MovieDetails.js';
import { API_KEY } from './config.js';


const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key='+ API_KEY + '&page=';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_KEY + '&query="';
const API_SHORTURL = 'https://api.themoviedb.org/3/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const pagination = document.querySelector('.pagination');
const clearSearch = document.querySelector('.clearSearch');

// Get initial movies
getMovies(API_URL);

// API
async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();

    showMovies(data.results);
    showPagination(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        
        const { title, poster_path, vote_average, overview, id } = movie;
        const movieEl = document.createElement('div');

        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                <button class="tickets" data-btnid="${id}">More Info</button>
                ${overview.slice(0,150) + (overview.length > 150 ? ` ...` : `` ) }
            </div>
        `;

        main.appendChild(movieEl);
    });

    let allBtnId = document.querySelectorAll('.tickets');
    

    allBtnId.forEach((btn) => {
        btn.addEventListener('click',  async (e) => {
            e.preventDefault();
            const movieId = e.currentTarget.dataset.btnid;

            const results = await Promise.all([
                fetch(`${API_SHORTURL}movie/${movieId}?api_key=${API_KEY}&include_adult=true`).catch((err) => { console.log(err); }),
                fetch(`${API_SHORTURL}movie/${movieId}/videos?api_key=${API_KEY}&include_adult=true`).catch((err) => { console.log(err); }),
                fetch(`${API_SHORTURL}movie/${movieId}/casts?api_key=${API_KEY}&include_adult=true`).catch((err) => { console.log(err); })
              ].map(url => url.then( (response) => response.json()))
              );
            
            const movieInfo = results[0];
            const videoPath = results[1];

            const casts = results[2].cast.map(cast => {
                return {
                    id: cast.id,
                    name: cast.name,
                    photo: cast.profile_path,
                    character: cast.character
                };
            });

            movieDetails(videoPath, casts, movieInfo);
        })
    })
}




function showPagination(data) {
    
    pagination.innerHTML = '' ;

    if(data.total_pages > 1 ) {
        const numPages = (data.total_pages > 6 ? 6 : data.total_pages);

        for( let i = 1 ; i <= numPages; i++) {
            const pageEl = document.createElement('a');
            pageEl.innerText = i;
            pageEl.onclick = paginationPages.bind(this, i);
            if( i === data.page ) {
                pageEl.classList.add('active');
            }
            pagination.appendChild(pageEl);
        }
    }
}

// Color rate for movie
function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}


// Show search results
form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
        // search.value = '';
    } else {
        window.location.reload();
    }
})


// Pagination
function paginationPages(index) {
    const newUrl = (search.value === '' ? ( API_URL + index) : (SEARCH_API + search.value + '&page=' + index));
    if(index >= 2){
        getMovies(newUrl);
    } else {
        window.location.reload();
    }

}

// Clear search input
clearSearch.addEventListener('click', e => {
    e.preventDefault();
    search.value = '';
    getMovies( API_URL + 1);
})

