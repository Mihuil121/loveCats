'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './syleComponent.module.scss';
import { Roboto } from 'next/font/google';
import { NextFont } from 'next/dist/compiled/@next/font';

const fontR: NextFont = Roboto({
  subsets: ['latin'],
  weight: '300',
});

const Header = () => {
  const [selectedButton, setSelectedButton] = useState<string>('All Cats');

  const handleButtonClick = (text: string) => {
    setSelectedButton(text);
  };

  return (
    <header className={styles.header}>
      <div className={styles.buttonContainer}>
        <Link href="/" passHref>
          <button
            onClick={() => handleButtonClick('All Cats')}
            className={`${styles.button} ${fontR.className}`}
            style={{
              backgroundColor: selectedButton === 'All Cats' ? '#6060605b' : '#afb5ba00',
            }}
          >
            Все котики
          </button>
        </Link>
        <Link href="/favorit" passHref>
          <button
            onClick={() => handleButtonClick('Any Cats')}
            className={`${styles.button} ${fontR.className}`}
            style={{
              backgroundColor: selectedButton === 'Any Cats' ? '#6060605b' : '#afb5ba00',
            }}
          >
            Любимые котики
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
