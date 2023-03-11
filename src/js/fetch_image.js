import axios from 'axios';
import {pageNumber, imgOnOnePage} from './main'

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
  };

export {fetchImage};