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

form.addEventListener('submit', throttle(getResult, 300));
loadMoreBtn.addEventListener('click', throttle(onLoadMoreBtn, 300));

const lightbox = new SimpleLightbox('.photo-card a', {
  captionPosition: 'bottom',
  captionDelay: 250,
  captionType: 'attr',
  disableScroll: true,
});

export let searchValue;
function getResult(e) {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.target;
  searchValue = searchQuery.value;

  if (searchValue === '') {
    alertMessage();
    return;
  }
  sendQuery(searchValue)
    .then(createGallery)
    .catch(error => console.log(error));
}

function createGallery(data) {
  if (data.totalHits === 0) {
    removeLoadMoreBtn();
    clearGallery();
    alertMessage();
    return;
  }
  resetPage();
  addLoadMoreBtn();
  clearGallery();
  amountOfSearchMessage(data);
  addGallery(data);
  lightbox.refresh();
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
      const resultHits = page.currentPage * data.hits.length;
      if (data.totalHits < resultHits) {
        messageAboutDoneHits();
        removeLoadMoreBtn();
      }
      addLoadMoreGalery(data);
      lightbox.refresh();
    })
    .catch(error => console.log(error));
}
function addLoadMoreGalery(data) {
  return galleryEl.insertAdjacentHTML('beforeend', renderGallery(data));
}
