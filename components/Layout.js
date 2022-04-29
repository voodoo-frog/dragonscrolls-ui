import useSWR from 'swr';
import { useState, useEffect } from 'react';

import Footer from './Footer';
import Navbar from './Navbar';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Layout({ children }) {
  const [dndClasses, setDndClasses] = useState([]);
  const { data: classes } = useSWR('/api/classes', fetcher);

  useEffect(() => {
    if (classes) {
      const sorted = classes.data.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      setDndClasses(sorted);
    }
  }, [classes]);

  return (
    <>
      <Navbar dndClasses={dndClasses} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
export default Layout;
