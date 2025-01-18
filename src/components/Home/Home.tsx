'use client';
import { useEffect, useState } from 'react';
import { useCatStore } from '../../app/store/catStore';
import styles from './Home.module.scss';  

interface IhandleScroll{
  ():void;
}

const HomePage = () => {
  const { catImages, loading, fetchCats } = useCatStore();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleScroll:IhandleScroll = () => {
    const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
    if (bottom && !loading && !isFetching) {
      setIsFetching(true);
      fetchCats().finally(() => setIsFetching(false));
    }
  };

  useEffect(() => {
    fetchCats();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchCats, isFetching, loading]);

  if (loading && catImages.length === 0) {
    return <div>Подгружаем котиков...</div>;
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.catImagesContainer}>
        {catImages.length > 0 ? (
          catImages.map((catImage, index) => (
            <div key={index} className={styles.catImageItem}>
              <img
                src={catImage.url}
                alt={`Cat ${index + 1}`}
                className={styles.catImage}
              />
            </div>
          ))
        ) : (
          <p>Could not fetch cat images</p>
        )}
      </div>
      {isFetching && <div>Загружаем больше котиков...</div>}
    </div>
  );
};

export default HomePage;
