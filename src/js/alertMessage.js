import { Notify } from 'notiflix';
export function alertMessage() {
  Notify.warning(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
export function amountOfSearchMessage(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}
export function messageAboutDoneHits() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
}
