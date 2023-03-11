import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';

var lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const formRef = document.querySelector('.search-form');
const inputRef = document.querySelector('input[name="searchQuery"]');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');

const imgOnOnePage = 40;
let pageNumber = 1;
let searchRequest;

formRef.addEventListener('submit', onFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreClick);
window.addEventListener('scroll', throttle(checkPosition, 300));
window.addEventListener('resize', throttle(checkPosition, 300));

function onFormSubmit(evt) {
  evt.preventDefault();
  
  searchRequest = searchRequestValidation(inputRef.value);
  clearMurkup();
    
  fetchImage(searchRequest)
    .then(responce => {
      Notify.success(`Hooray! We found ${responce.totalHits} images.`)
      calculateMaxAbleFathes(responce.totalHits)
      return responce.hits
    })
    .then(data => createMurkup(data))
    .catch(error => Notify.failure(error));
}

function clearMurkup() {
  galleryRef.innerHTML = '';
  pageNumber = 1;
}

function searchRequestValidation(str) {
  return str
    .trim()
    .split(' ')
    .filter(el => el !== '')
    .join('+');
}

async function fetchImage(toSearch) {
  const URL = 'https://pixabay.com/api/';
  const KEY = '?key=34196559-a18bb514e6ee4bb855d37fd2b';
  const FILTER = '&image_type=photo&orientation=horizontal&safesearch=true';
  const pagination = `&page=${pageNumber}&per_page=${imgOnOnePage}`;
  const request = `${URL}${KEY}&q=${toSearch}${FILTER}${pagination}`;

  const getImgData = await axios.get(request);
  const parsedImgData = getImgData.data;
  
  if (parsedImgData.hits.length === 0) {   
    return Promise.reject('Sorry, there are no images matching your search query. Please try again.')
  };

  return parsedImgData;
}

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

function onLoadMoreClick() {
  pageNumber += 1;

  fetchImage(searchRequest)
    .then(responce => createMurkup(responce.hits))
    // .then(evt => autoScroll())
    .catch(error => Notify.failure(error));   
}

let maxAbleFathes 

function calculateMaxAbleFathes(amountImage) {  
  maxAbleFathes = Math.floor(amountImage / imgOnOnePage);
}

function checkPosition() {
  const bodyHeight = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = bodyHeight - screenHeight / 2;
  const position = scrolled + screenHeight;
  
  if (position >= threshold) {
    if (maxAbleFathes >= pageNumber)
    onLoadMoreClick()
  }
}

// ==========LOAD MORE BUTTON REALISATION==========
// function autoScroll() {
//   const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();
  
//   window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
//   });
// }
// ^^^^^^^^^^LOAD MORE BUTTON REALISATION^^^^^^^^^^