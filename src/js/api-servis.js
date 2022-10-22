import axios from 'axios';
import Notiflix from 'notiflix';

export default class PicturesApiService {
  #BASE_URL = 'https://pixabay.com/api/';
  #KEY = '30553592-7f8cf46d4a7791408268d5968';
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.picturesPerPage = 40;
    this.remainPages = 0;
  }

  async fetchSearchValue() {
    const params = {
      key: this.#KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.picturesPerPage,
    };
    try {
      const response = await axios.get(this.#BASE_URL, { params });
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.error(error);
      console.log(error.response.status);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
