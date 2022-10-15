const BASE_URl = 'https://pixabay.com/api/';
const KEY = '30553592-7f8cf46d4a7791408268d5968';

export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchSearchValue() {
    return fetch(
      `${BASE_URl}/?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    )
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
       
        return response.json();
      })
      .then(({ hits}) => {
        this.incrementPage();
        return hits;
      })
      .catch(error => {
        console.log(error);
      });
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


