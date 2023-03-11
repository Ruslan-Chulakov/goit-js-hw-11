import { Notify } from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";
import throttle from 'lodash.throttle';
import { fetchImage } from './fetch_image';
import { createMurkup } from './create_murkup';
import { clearMurkup } from './clear_murkup';
import { searchRequestValidation } from './search_request_validation';
import { onLoadMoreEvent } from './on_load_more_event';

const formRef = document.querySelector('.search-form');
const inputRef = document.querySelector('input[name="searchQuery"]');
const galleryRef = document.querySelector('.gallery');
// const loadMoreBtnRef = document.querySelector('.load-more');  // using for load more button

const imgOnOnePage = 40;
let pageNumber = 1;
let searchRequest;
let maxAbleFathes;

formRef.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', throttle(checkPosition, 300));
window.addEventListener('resize', throttle(checkPosition, 300));
// loadMoreBtnRef.addEventListener('click', onLoadMoreEvent); // using for load more button

function onFormSubmit(evt) {
  evt.preventDefault();
  
  searchRequest = searchRequestValidation(inputRef.value);
   
  clearMurkup();
  pageNumber = 1;
    
  fetchImage(searchRequest)
    .then(responce => {
      Notify.success(`Hooray! We found ${responce.totalHits} images.`)
      calculateMaxAbleFathes(responce.totalHits)
      return responce.hits
    })
    .then(data => createMurkup(data))
    .catch(error => Notify.failure(error));
};

function calculateMaxAbleFathes(amountImage) {  
  maxAbleFathes = Math.floor(amountImage / imgOnOnePage);
};

function checkPosition() {
  const bodyHeight = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = bodyHeight - screenHeight / 2;
  const position = scrolled + screenHeight;
  
  if (position >= threshold) {
    
    if (maxAbleFathes === pageNumber) {
      Notify.warning("We're sorry, but you've reached the end of search results.")
    };
    
    if (maxAbleFathes >= pageNumber) {
      pageNumber += 1;
      onLoadMoreEvent(searchRequest);
    };
  };
};

export {pageNumber, imgOnOnePage, galleryRef, searchRequest};

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