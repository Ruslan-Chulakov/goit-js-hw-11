import SimpleLightbox from "simplelightbox";
import { galleryRef } from "./main";
 
var lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });

function createMurkup(data) {
    const murkup = data
      .map(
        el =>
      `    
      <div class="photo-card">
          <a href="${el.largeImageURL}">
              <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
          </a>
          <div class="info">
              <p class="info-item">
              <b>Likes</b>
              ${el.likes}
              </p>
              <p class="info-item">
              <b>Views</b>
              ${el.views}
              </p>
              <p class="info-item">
              <b>Comments</b>
              ${el.comments}
              </p>
              <p class="info-item">
              <b>Downloads</b>
              ${el.downloads}
              </p>
          </div>
       </div>
      `
      ).join('');
    galleryRef.insertAdjacentHTML('beforeend', murkup);
    
    lightbox.refresh() 
  }

  export {createMurkup};