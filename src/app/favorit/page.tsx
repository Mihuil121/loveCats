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

  useEffect(() => {
    loadLovedCats();
  }, [loadLovedCats]);

  useEffect(() => {
    setLovedCatIds(lovedCats);
  }, [lovedCats]);

  const handleRemoveLovedCat = (catId: string) => {
    removeLovedCat(catId);
  };

  const handleHeartClick = (catId: string) => {
    const updatedLovedCats = lovedCatIds.filter(id => id !== catId);
    setLovedCatIds(updatedLovedCats);
    handleRemoveLovedCat(catId);
  };

  const lovedCatImages = catImages.filter((cat) => lovedCatIds.includes(cat.id));

  return (
    <div className={styles.homePage}>
      <h2>Избранные котики</h2>
      {lovedCatImages.length > 0 ? (
        <div className={styles.catImagesContainer}>
          {lovedCatImages.map((catImage: CatImage) => (
            <div key={catImage.id} className={styles.catImageItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={catImage.url}
                  alt={`Cat ${catImage.id}`}
                  className={styles.catImage}
                  layout="responsive"
                  width={100}
                  height={100}
                />
                <FaHeart
                  className={`${styles.heartIcon} ${lovedCatIds.includes(catImage.id) ? styles.heartRed : ''}`}
                  style={{ color: lovedCatIds.includes(catImage.id) ? 'red' : 'white' }}
                  onClick={() => handleHeartClick(catImage.id)}
                />
                <button
                  onClick={() => handleRemoveLovedCat(catImage.id)}
                  className={styles.removeButton}
                >
                  Убрать из избранного
                </button>
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
