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
import ScrollMagic from 'scrollmagic';
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

  sendQuery(searchValue)
    .then(data => {
      resultHits = resultHits + data.hits.length;
      if (data.totalHits === resultHits) {
        messageAboutDoneHits();
        removeLoadMoreBtn();
      }
      addLoadMoreGalery(data);
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      lightbox.refresh();
    })
    .catch(error => console.log(error));
}
function addLoadMoreGalery(data) {
  return galleryEl.insertAdjacentHTML('beforeend', renderGallery(data));
}

// // init controller
// var controller = new ScrollMagic.Controller();

// // build scene
// var scene = new ScrollMagic.Scene({
//   triggerElement: '.dynamicContent #loader',
//   triggerHook: 'onEnter',
// })
//   .addTo(controller)
//   .on('enter', function (e) {
//     if (!$('#loader').hasClass('active')) {
//       $('#loader').addClass('active');
//       if (console) {
//         console.log('loading new items');
//       }
//       // simulate ajax call to add content using the function below
//       setTimeout(addBoxes, 1000, 9);
//     }
//   });

// // pseudo function to add new content. In real life it would be done through an ajax request.
// function addBoxes(amount) {
//   for (i = 1; i <= amount; i++) {
//     var randomColor =
//       '#' +
//       ('00000' + ((Math.random() * 0xffffff) << 0).toString(16)).slice(-6);
//     $('<div></div>')
//       .addClass('box1')
//       .css('background-color', randomColor)
//       .appendTo('.dynamicContent #content');
//   }
//   // "loading" done -> revert to normal state
//   scene.update(); // make sure the scene gets the new start position
//   $('#loader').removeClass('active');
// }

// // add some boxes to start with.
// addBoxes(40);
