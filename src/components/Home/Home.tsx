'use client';
import { useEffect, useState } from 'react';
import { useCatStore, useIdCatStore } from '../../app/store/catStore';
import styles from './Home.module.scss';
import { CatImage } from '@/app/api';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';

interface MouseHandler {
  (index: number): void;
}

interface LocalStorageHandler {
  (catId: string): void;
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
    loadLovedCats();
  }, [catImages]);

  const handleScroll = (): void => {
    const isAtBottom: boolean = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100;
    if (isAtBottom && !loading && !isFetching) {
      setIsFetching(true);
      fetchCats().finally(() => setIsFetching(false));
    }
  };

  const handerLoveb = (index: number): void => {
    const catId: string = catImages[index].id;
    storeId(catId);

    const newLove: boolean[] = [...useLove];
    if (newLove[index]) {
      newLove[index] = false;
      removeLovedCat(catId);
    } else {
      newLove[index] = true;
      addLovedCat(catId);
    }
    setLove(newLove);
  };

  const onMouse: MouseHandler = (index) => {
    const newMouse: boolean[] = [...useMouse];
    newMouse[index] = true;
    setMouse(newMouse);
  };

  const offMouse: MouseHandler = (index) => {
    const newMouse: boolean[] = [...useMouse];
    newMouse[index] = false;
    setMouse(newMouse);
  };

  const loadLovedCats = (): void => {
    const savedCats: string | null = localStorage.getItem('lovedCats');
    if (savedCats) {
      const lovedCatIds: string[] = JSON.parse(savedCats);
      const updatedLove: boolean[] = catImages.map((cat) => lovedCatIds.includes(cat.id));
      setLove(updatedLove);
    }
  };

  const addLovedCat: LocalStorageHandler = (catId) => {
    const savedCats: string | null = localStorage.getItem('lovedCats');
    const lovedCatIds: string[] = savedCats ? JSON.parse(savedCats) : [];
    lovedCatIds.push(catId);
    localStorage.setItem('lovedCats', JSON.stringify(lovedCatIds));
  };

  const removeLovedCat: LocalStorageHandler = (catId) => {
    const savedCats: string | null = localStorage.getItem('lovedCats');
    if (savedCats) {
      const lovedCatIds: string[] = JSON.parse(savedCats);
      const updatedLovedCats: string[] = lovedCatIds.filter((id) => id !== catId);
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
                  width={400}
                  height={400}
                  style={{
                    transition: '0.51s',
                    boxShadow: useMouse[index] ? '0.188rem 0.188rem black, -1em 1rem 0.25em black' : 'none',
                  }}
                  onError={(e) => {
                    console.error(`Error loading image: ${catImage.url}`);
                    e.currentTarget.src = '/fallback-cat.jpg';
                  }}
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
