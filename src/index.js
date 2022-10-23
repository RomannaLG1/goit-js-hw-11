import './css/styles.css';
import Notiflix from 'notiflix';
import PicturesApiService from './js/api-servis';
import picturesCardTpl from '../templates/pictures-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const refs = {
  searchForm: document.querySelector('#search-form'),
  inputEl: document.querySelector('input'),
  buttonEl: document.querySelector('button'),
  galleryContainer: document.querySelector('.gallery'),
  guard: document.querySelector('.guard'),
  dotterContainer: document.querySelector('.container'),
};

let lightbox = new SimpleLightbox('.image', {
  captionsData: 'alt',
  captionDelay: 250,
});

const picturesApiService = new PicturesApiService();
dotterHide();

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(evt) {
  evt.preventDefault();

  picturesApiService.query =
    evt.currentTarget.elements.searchQuery.value.trim();
  if (!picturesApiService.query) {
    noFoundAnyImg();
    return;
  }
  picturesApiService.resetPage();
  try {
    const data = await picturesApiService.fetchSearchValue();
    if (!data.hits || data.hits.length === 0) {
      clearHitsContainer();
      noFoundAnyImg();
      return;
    }
    Notiflix.Notify.success(`Hoorey! We found ${data.totalHits} images`);
    clearHitsContainer();
    appendHitsMarkup(data.hits);
    lightbox.refresh();
    dotterShow();
    smoothScroll(picturesApiService.page);
    console.log(picturesApiService.page);
  } catch {
    messageError();
  }
  observer.observe(refs.guard);
}

const options = {
  root: null,
  rootMargin: '50px',
  threshold: 1,
};

const observer = new IntersectionObserver(onLoadMore, options);

async function onLoadMore(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      dotterShow();
    }
  });
  const data = await picturesApiService.fetchSearchValue();
  if (!data.hits || data.hits.length === 0) {
    observer.unobserve(refs.guard);
    dotterHide();
    endGalleryImg();
    return;
  }
  appendHitsMarkup(data.hits);
  lightbox.refresh();
  dotterShow();
  smoothScroll(picturesApiService.page);
}

function appendHitsMarkup(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', picturesCardTpl(hits));
}

function clearHitsContainer() {
  refs.galleryContainer.innerHTML = '';
}

function dotterShow() {
  refs.dotterContainer.classList.remove('container-hidden');
}

function dotterHide() {
  refs.dotterContainer.classList.add('container-hidden');
}

function noFoundAnyImg() {
  Notiflix.Notify.warning(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  return;
}

function endGalleryImg() {
  Notiflix.Notify.warning(
    "We're sorry, but you've reached the end of search results."
  );
  return;
}

function messageError() {
  Notiflix.Notify.failure('Sorry, somthing was wranng! Can try');
}

function smoothScroll(currentPage) {
  if (currentPage === 1 || currentPage === 2) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      left: cardHeight * 1.5,
      behavior: 'smooth',
    });
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
}
