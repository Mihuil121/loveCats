'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useCatStore, useIdCatStore } from '../../app/store/catStore';
import styles from './Home.module.scss';
import { CatImage } from '@/app/api';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const { catImages, loading, fetchCats } = useCatStore();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { storeId } = useIdCatStore();
  const [useLove, setLove] = useState<boolean[]>([]);
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchCats();
    loadLovedCats();

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));

          if (entry.isIntersecting) {
            setVisibleImages((prev) => new Set(prev).add(index));
          } else {
            setVisibleImages((prev) => {
              const updated = new Set(prev);
              updated.delete(index);
              return updated;
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [fetchCats]);

  const loadLovedCats = (): void => {
    const savedCats = localStorage.getItem('lovedCats');
    if (savedCats) {
      const lovedCatIds = JSON.parse(savedCats);
      setLove(catImages.map((cat) => lovedCatIds.includes(cat.id)));
    }
  };

  const handleScroll = useCallback((): void => {
    const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100;
    if (isAtBottom && !loading && !isFetching) {
      setIsFetching(true);
      fetchCats().finally(() => setIsFetching(false));
    }
  }, [loading, isFetching, fetchCats]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleLove = (index: number): void => {
    const catId = catImages[index].id;
    storeId(catId);

    setLove((prevLove) => {
      const newLove = [...prevLove];
      newLove[index] = !newLove[index];
      updateLovedCats(catId, newLove[index]);
      return newLove;
    });
  };

  const updateLovedCats = (catId: string, isLoved: boolean): void => {
    const savedCats = localStorage.getItem('lovedCats');
    const lovedCatIds = savedCats ? JSON.parse(savedCats) : [];

    if (isLoved) {
      lovedCatIds.push(catId);
    } else {
      const index = lovedCatIds.indexOf(catId);
      if (index > -1) lovedCatIds.splice(index, 1);
    }

    localStorage.setItem('lovedCats', JSON.stringify(lovedCatIds));
  };

  const observeImage = useCallback((node: HTMLDivElement | null, index: number) => {
    if (!node || !observer.current) return;

    node.setAttribute('data-index', String(index));
    observer.current.observe(node);
  }, []);

  const preloadImage = (src: string): void => {
    const img = new window.Image();
    img.src = src;
  };

  useEffect(() => {
    visibleImages.forEach((index) => {
      const imageUrl = catImages[index]?.url;
      if (imageUrl) {
        preloadImage(imageUrl);
      }
    });
  }, [visibleImages, catImages]);

  if (loading && catImages.length === 0) {
    return <div className={styles.homePage}>Подгружаем котиков...</div>;
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.catImagesContainer}>
        {catImages.map((catImage: CatImage, index: number) => (
          <div
            key={catImage.id}
            className={styles.catImageItem}
            ref={(node) => observeImage(node, index)}
          >
            <div className={styles.imageWrapper} onClick={() => toggleLove(index)}>
              {visibleImages.has(index) ? (
                <Image
                  src={catImage.url}
                  alt={`Cat ${index + 1}`}
                  className={styles.catImage}
                  width={400}
                  height={400}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/fallback-cat.jpg';
                  }}
                />
              ) : (
                <div className={styles.placeholder} style={{ width: 400, height: 400 }} />
              )}
              <FaHeart
                className={`${styles.heartIcon} ${useLove[index] ? styles.heartHovered : ''}`}
                style={{ color: useLove[index] ? 'red' : 'white' }}
              />
            </div>
          </div>
        ))}
      </div>
      {isFetching && <div>Загружаем больше котиков...</div>}
    </div>
  );
};

export default HomePage;

