import { Notify } from "notiflix";
import { fetchImage } from "./fetch_image";
import { createMurkup } from "./create_murkup";
import { searchRequest} from './main'

function onLoadMoreEvent(ref) {
    fetchImage(ref)
    .then(responce => createMurkup(responce.hits))
    // .then(evt => autoScroll())                  // using for load more button
    .catch(error => Notify.failure(error));    
  }

export {onLoadMoreEvent};