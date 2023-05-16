import React, { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from '../api/fetchImage';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from '../components/Loader/Loader';

import styles from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    if (query !== '') {
      fetchImageData(query, page);
    }
  }, [query, page]);

  const resetState = () => {
    setPage(1);
    setImages([]);
    setError(null);
  };

  const fetchImageData = (query, page) => {
    setIsLoading(true);
    fetchImages(query, page)
      .then(imgPixabay => {
        if (imgPixabay.totalHits > 0) {
          setImages(prevImages => [...prevImages, ...imgPixabay.hits]);
          setTotalHits(imgPixabay.totalHits);
        } else {
          setError('No images matching your search query');
        }
      })
      .catch(() => {
        setError('No pictures were found');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = event => {
    event.preventDefault();
    const { value } = event.target.elements.input;
    const query = value.trim();

    if (query === '') {
      setError('Search field can not be empty');
    } else {
      setQuery(query);
      resetState();
      setError(null);
    }
  };

  const nextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleImgClick = activeImg => {
    setActiveImg({ ...activeImg });
    openModal();
  };

  return (
    <>
      <Searchbar onSubmit={onSubmit} />
      {isLoading && <Loader className={styles.loader} />}
      {showModal && <Modal activeImg={activeImg} closeModal={closeModal} />}
      {error && <div className={styles.error}>{error}</div>}
      {images && (
        <ImageGallery handleImgClick={handleImgClick} images={images} />
      )}
      {!isLoading && !error && images && totalHits > images.length && (
        <Button nextPage={nextPage} />
      )}
    </>
  );
};

export default App;
