import { galleryRef } from "./main";

function clearMurkup() {
    galleryRef.innerHTML = '';
    pageNumber = 1;
  };

export {clearMurkup};