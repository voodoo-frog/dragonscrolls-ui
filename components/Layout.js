import useSWR from 'swr';
import { useState, useEffect } from 'react';
import styles from '../styles/Layout.module.css';

// import Footer from './Footer';
import Navbar from './Navbar';
import { sorter, fetcher } from '../lib/common';

function Layout({ children }) {
  const [dndClasses, setDndClasses] = useState([]);

  const { data: classes } = useSWR('/api/classes', fetcher);

  useEffect(() => {
    if (classes) {
      const sorted = sorter(classes.data);
      setDndClasses(sorted);
    }
  }, [classes]);

  return (
    <div className={styles.main}>
      <Navbar dndClasses={dndClasses} />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
export default Layout;
