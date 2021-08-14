
export default function movieDetails(videoURL, casts, movieInfo) {

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Eliminate all elements
    document.getElementById('main').style.display = 'none';
    document.querySelector('.pagination').style.display = 'none';
    document.getElementById('form').style.visibility = 'hidden';
    document.querySelector('header h1').style.display = 'none';

    const movieDetails = document.querySelector('.movie-details');
    const castsList = document.querySelector('.casts-list');
    const arrowBack = document.querySelector('.arrow-back');
    let favoriteArr = JSON.parse(localStorage.getItem('favorites'));

    
    arrowBack.style.visibility = 'visible';


    // Show casts
    castsList.innerHTML = '';

    casts.slice(0,10).forEach(cast => {
        const { id , name , photo , character} = cast;
        
        const castEl = document.createElement('div');
        castEl.classList.add('card');
        castEl.dataset.id = `${id}`;

        castEl.innerHTML = `
                    ${photo ? `<img src="http://image.tmdb.org/t/p/w300${photo}" alt="${name}"></img>` :
                    `<p class="flow-text">No photo available</p>` }
                    <h3>${name}</h3>
                    <h3>"${character}"</h3>
        `;
      
        castsList.appendChild(castEl);
    });
    
    // Get video path
    const videoPath = videoURL.results[0] ? 
        `<iframe src="https://www.youtube.com/embed/${videoURL.results[0].key}" 
                frameborder="0" 
                allowfullscreen
                height="300" width="500"></iframe>` :
        '<p class="flow-text">No video available</p>' ; 

    

    // Show movie details 
    const videoHTML = ` 
            <div class="video-container"> 
                ${videoPath}
            </div>
            <div class = "vertical"></div>
            <div class="video-info">
                <h3>${movieInfo.original_title} 
                ${localStorage.getItem('favorites') !== null && favoriteArr.some(ele => ele === movieInfo.id) ? 
                    `<a class="material-icons prefix favorite" style="color:gold" title="Add to favorites">
                    favorite</a>` : 
                    `<a class="material-icons prefix favorite" title="Add to favorites">
                    favorite</a>`}
                    </h3>
                <h5><b>Runtime:</b>  ${Math.floor(movieInfo.runtime / 60)} hr ${movieInfo.runtime % 60} min</h5>
                <h5><b>Release date:</b> ${movieInfo.release_date}</h5>
                <div class="video-overview">
                    ${movieInfo.overview}
                </div>
            </div>
     `;


     castsList.insertAdjacentHTML('beforebegin', videoHTML);
    

     // Manage favorite movies in local storage
     const favorite = document.querySelector('.favorite');

     favorite.addEventListener('click', e => {
         e.preventDefault();

         let favorites = [];
        
         const localFavorites = JSON.parse(localStorage.getItem('favorites'));

         if(localFavorites === null || localFavorites === []) {
            // Storage is empty
            favorites.push(movieInfo.id);
            favorite.style.color = 'gold'; 
         }
         else {
            if(favoriteArr.some(ele => ele === movieInfo.id)) {
                // The element is in storage and needs to be deleted
                favorites = favoriteArr.filter(ele => ele !== movieInfo.id);
                favorite.style.color = 'white';
            } else {
                // The element don't exist in storage and needs to be added
                favorites = [...JSON.parse(localStorage.getItem('favorites')), movieInfo.id];
                favorite.style.color = 'gold'; 
            }
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        favoriteArr = JSON.parse(localStorage.getItem('favorites'));
     }) 

}



