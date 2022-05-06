import useSWR from 'swr';
import { useState, useEffect } from 'react';

import Footer from './Footer';
import Navbar from './Navbar';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Layout({ children }) {
  const [dndClasses, setDndClasses] = useState([]);
  const [dndRaces, setDndRaces] = useState([]);

  const { data: classes } = useSWR('/api/classes', fetcher);
  const { data: races } = useSWR('/api/races', fetcher);

  useEffect(() => {
    if (classes) {
      const sorted = classes.data.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      setDndClasses(sorted);
    }
    if (races) {
      console.log('races', races);
      const sorted = races.data.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      setDndRaces(sorted);
    }
  }, [classes, races]);

  return (
    <>
      <Navbar dndClasses={dndClasses} races={dndRaces} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
export default Layout;
