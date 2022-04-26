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
      setDndClasses(classes.data);
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
