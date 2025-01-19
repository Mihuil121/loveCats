'use client';
import { useEffect, useState } from 'react';
import { useCatStore, useIdCatStore } from '../../app/store/catStore';
import styles from './Home.module.scss';
import { CatImage } from '@/app/api';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';

interface IMouse {
  (index: number): boolean
}

const HomePage = () => {
  const { catImages, loading, fetchCats } = useCatStore();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [useMouse, setMouse] = useState<boolean[]>([]);
  const { storeId } = useIdCatStore();
  const [useLove, setLove] = useState<boolean[]>([]);

  useEffect(() => {
    fetchCats();
    window.addEventListener('scroll', handleScroll);
    loadLovedCats();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchCats]);

  useEffect(() => {
    setMouse(Array(catImages.length).fill(false));
  }, [catImages]);

  useEffect(() => {
    loadLovedCats(); // Ensures love status is checked every time the component is rendered
  }, [catImages]);

  const handleScroll = () => {
    const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100;
    if (isAtBottom && !loading && !isFetching) {
      setIsFetching(true);
      fetchCats().finally(() => setIsFetching(false));
    }
  };

  const handerLoveb = (index: number) => {
    const catId: string = catImages[index].id;
    storeId(catId);

    const newLove = [...useLove];
    if (newLove[index]) {
      newLove[index] = false;
      removeLovedCat(catId);
    } else {
      newLove[index] = true;
      addLovedCat(catId);
    }
    setLove(newLove);
  };

  const onMouse: IMouse = (index) => {
    const newMouse: boolean[] = [...useMouse];
    newMouse[index] = true;
    setMouse(newMouse);
    return true;
  };

  const offMouse: IMouse = (index) => {
    const newMouse = [...useMouse];
    newMouse[index] = false;
    setMouse(newMouse);
    return false;
  };

  const loadLovedCats = () => {
    const savedCats = localStorage.getItem('lovedCats');
    if (savedCats) {
      const lovedCatIds = JSON.parse(savedCats);
      const updatedLove = catImages.map((cat) => lovedCatIds.includes(cat.id));
      setLove(updatedLove); // Sync love state with localStorage
    }
  };

  const addLovedCat = (catId: string) => {
    const savedCats = localStorage.getItem('lovedCats');
    const lovedCatIds = savedCats ? JSON.parse(savedCats) : [];
    lovedCatIds.push(catId);
    localStorage.setItem('lovedCats', JSON.stringify(lovedCatIds));
  };

  const removeLovedCat = (catId: string) => {
    const savedCats = localStorage.getItem('lovedCats');
    if (savedCats) {
      const lovedCatIds = JSON.parse(savedCats);
      const updatedLovedCats = lovedCatIds.filter((id: string) => id !== catId);
      localStorage.setItem('lovedCats', JSON.stringify(updatedLovedCats));
    }
  };

  if (loading && catImages.length === 0) {
    return <div className={styles.homePage}>Подгружаем котиков...</div>;
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.catImagesContainer}>
        {catImages.length > 0 ? (
          catImages.map((catImage: CatImage, index: number) => (
            <div
              key={index}
              className={styles.catImageItem}
              onMouseEnter={() => onMouse(index)}
              onMouseLeave={() => offMouse(index)}
            >
              <div className={styles.imageWrapper} onClick={() => handerLoveb(index)}>
                <Image
                  src={catImage.url}
                  alt={`Cat ${index + 1}`}
                  className={styles.catImage}
                  layout="responsive"
                  style={{
                    transition: '1s',
                    boxShadow: useMouse[index] ? '3px 3px black, -1em 1rem .4em black' : 'none',
                  }}
                  width={100}
                  height={100}
                />
                <FaHeart
                  className={`${styles.heartIcon} ${useMouse[index] ? styles.heartHovered : ''}`}
                  style={{ color: useLove[index] ? 'red' : 'white' }}
                />
              </div>
            </div>
          ))
        ) : (
          <p>Не удалось загрузить изображения котиков</p>
        )}
      </div>
      {isFetching && <div>Загружаем больше котиков...</div>}
    </div>
  );
};

export default HomePage;
