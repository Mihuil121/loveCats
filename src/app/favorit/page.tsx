'use client';
import { useEffect, useState } from 'react';
import { useLocalStore } from '../../app/store/catStore';
import { useCatStore } from '../../app/store/catStore';
import { CatImage } from '@/app/api';
import Image from 'next/image';
import styles from '../../components/Home/Home.module.scss';
import { FaHeart } from 'react-icons/fa';

const FavoritesPage = () => {
  const { lovedCats, loadLovedCats, removeLovedCat } = useLocalStore((state) => state);
  const { catImages } = useCatStore((state) => state);
  const [lovedCatIds, setLovedCatIds] = useState<string[]>([]);
  const [useMouse, setMouse] = useState<boolean[]>([]);

  useEffect(() => {
    loadLovedCats();
  }, [loadLovedCats]);

  useEffect(() => {
    setLovedCatIds(lovedCats);
    setMouse(Array(lovedCats.length).fill(false));
  }, [lovedCats]);

  const handleRemoveLovedCat = (catId: string) => {
    removeLovedCat(catId);
    setLovedCatIds(prev => prev.filter(id => id !== catId));
  };

  const onMouse = (index: number) => {
    const newMouse = [...useMouse];
    newMouse[index] = true;
    setMouse(newMouse);
  };

  const offMouse = (index: number) => {
    const newMouse = [...useMouse];
    newMouse[index] = false;
    setMouse(newMouse);
  };

  const uniqueLovedCatImages = catImages.filter((cat) => {
    return lovedCatIds.includes(cat.id) && 
           catImages.findIndex(c => c.id === cat.id) === catImages.indexOf(cat);
  });

  return (
    <div className={styles.homePage}>
      {uniqueLovedCatImages.length > 0 ? (
        <div className={styles.catImagesContainer}>
          {uniqueLovedCatImages.map((catImage: CatImage, index: number) => (
            <div 
              key={catImage.id} 
              className={styles.catImageItem}
              onMouseEnter={() => onMouse(index)}
              onMouseLeave={() => offMouse(index)}
            >
              <div 
                className={styles.imageWrapper} 
                onClick={() => handleRemoveLovedCat(catImage.id)}
              >
                <Image
                  src={catImage.url}
                  alt={`Cat ${catImage.id}`}
                  className={styles.catImage}
                  width={400}
                  height={400}
                  style={{
                    transition: '0.3s',
                    boxShadow: useMouse[index] ? '0.188rem 0.188rem black, -1em 1rem 0.25em black' : 'none',
                  }}
                  onError={(e) => {
                    console.error(`Error loading image: ${catImage.url}`);
                    e.currentTarget.src = '/fallback-cat.jpg';
                  }}
                />
                <FaHeart
                  className={`${styles.heartIcon} ${useMouse[index] ? styles.heartHovered : ''}`}
                  style={{ color: 'red' }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>У вас нет избранных котиков!</p>
      )}
    </div>
  );
};

export default FavoritesPage;
