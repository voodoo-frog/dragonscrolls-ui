import Head from 'next/head';
import styles from '../styles/Home.module.css';

import Class from '../models/class';
import dbConnect from '../lib/dbConnect';
import Image from 'next/image';

export default function Home({ classes }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dragon Scrolls by Byron</title>
        <meta
          name="description"
          content="Personal project for D&amp;D 5e wiki and character creation including all source books and adventure books"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <Image
          src={`/images/dnd-party.png`}
          layout="fill"
          alt="dnd party"
          objectFit="contain"
          objectPosition="right"
          style={{ zIndex: -1, marginTop: 100 }}
        /> */}
        <h1>HOME PAGE</h1>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  await dbConnect();

  /* Classes */
  const result = await Class.find({});
  const classes = result.map((doc) => {
    const dndClass = doc.toObject();
    dndClass._id = dndClass._id.toString();
    return dndClass;
  });

  return { props: { classes: classes } };
}
