export function renderGallery(data) {
  return data.hits
    .map(
      ({
        comments,
        downloads,
        views,
        likes,
        tags,
        largeImageURL,
        webformatURL,
      }) => {
        return `<div class="photo-card">
            <a href="${largeImageURL}" ><img class="photo-card-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
          <div class="info">
            <p class="info-item">
                 <b>Likes</b><span> ${likes}</span>
            </p>
            <p class="info-item">
               <b>Views </b><span>${views}</span>
            </p>
            <p class="info-item">
               <b>Comments</b><span>${comments}</span>
            </p>
            <p class="info-item">
               <b>Downloads</b><span>${downloads}</span>
             </p>
         </div></div>`;
      }
    )
    .join('');
}
