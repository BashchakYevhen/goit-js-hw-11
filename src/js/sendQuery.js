import { messageAboutDoneHits } from './alertMessage';
import { removeLoadMoreBtn } from '../index';
export const page = {
  DEFAULT_PAGE: 1,
  currentPage: 1,
};

export async function sendQuery(searchValue) {
  const axios = require('axios');
  const userKey = 'key=28417752-d5982fc4557f983ae3969af04';
  const url = 'https://pixabay.com/api/';
  try {
    const response = await axios.get(
      `${url}?${userKey}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page.currentPage}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
