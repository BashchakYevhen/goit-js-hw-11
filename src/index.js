import { sendQuery, page } from './js/sendQuery';
import { renderGallery } from './js/renderGallery';
import {
  alertMessage,
  amountOfSearchMessage,
  messageAboutDoneHits,
} from './js/alertMessage';
import SimpleLightBox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
const form = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let resultHits = 0;

form.addEventListener('submit', throttle(getResult, 10));
loadMoreBtn.addEventListener('click', throttle(onLoadMoreBtn, 10));

const lightbox = new SimpleLightbox('.photo-card a', {
  captionPosition: 'bottom',
  captionDelay: 250,
  captionType: 'attr',
  disableScroll: true,
});

export let searchValue;
function getResult(e) {
  e.preventDefault();
  resetPage();
  clearGallery();
  removeLoadMoreBtn();
  resultHits = 0;
  const {
    elements: { searchQuery },
  } = e.target;
  searchValue = searchQuery.value.trim();

  if (searchValue === '') {
    alertMessage();
    return;
  }
  console.log(resultHits);
  sendQuery(searchValue)
    .then(createGallery)
    .catch(error => console.log(error));
}

function createGallery(data) {
  resultHits = resultHits + data.hits.length;

  if (data.totalHits === 0) {
    removeLoadMoreBtn();
    clearGallery();
    alertMessage();
    return;
  }
  if (data.totalHits > 40) {
    addLoadMoreBtn();
  }

  amountOfSearchMessage(data);
  addGallery(data);
  lightbox.refresh();
  console.log(resultHits);
}
const addGallery = data => {
  return (galleryEl.innerHTML = renderGallery(data));
};

function clearGallery() {
  galleryEl.innerHTML = '';
}
function resetPage() {
  return (page.currentPage = page.DEFAULT_PAGE);
}
function addLoadMoreBtn() {
  loadMoreBtn.classList.remove('visually-hidden');
}
export function removeLoadMoreBtn() {
  loadMoreBtn.classList.add('visually-hidden');
}
function onLoadMoreBtn(e) {
  e.preventDefault();
  page.currentPage += 1;
  console.log(page.currentPage);
  sendQuery(searchValue)
    .then(data => {
      resultHits = resultHits + data.hits.length;
      if (data.totalHits === resultHits) {
        messageAboutDoneHits();
        removeLoadMoreBtn();
      }
      addLoadMoreGalery(data);
      lightbox.refresh();
      console.log(resultHits);
    })
    .catch(error => console.log(error));
}
function addLoadMoreGalery(data) {
  return galleryEl.insertAdjacentHTML('beforeend', renderGallery(data));
}
