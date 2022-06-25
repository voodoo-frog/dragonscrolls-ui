import Image from 'next/image';
import { AspectRatio, Title, Text, Container, Divider } from '@mantine/core';

import Feature from '../../../models/feature';
import Subclasses from '../../../models/subclass';

import dbConnect from '../../../lib/dbConnect';
import Link from 'next/link';

function Subclass({ singleSubclass, classFeatures }) {
  const { index, name, desc, source_book } = singleSubclass;
  console.log('singleSubclass.class', singleSubclass.class);

  return (
    <Container px="md">
      <Title order={1}>{name}</Title>
      <AspectRatio ratio={720 / 1080} sx={{ maxWidth: 300 }} mx="auto">
        <Image
          src={`/images/${singleSubclass.class.index}-${index}.png`}
          layout="fill"
          alt={`${singleSubclass.class.name} - ${name} subclass`}
          objectFit="cover"
          objectPosition="top"
        />
      </AspectRatio>
      <Text>Source: {source_book}</Text>
      <Text>{desc}</Text>
      {classFeatures.map((feature) => {
        if (feature.subclass)
          return (
            <>
              <Title order={3} key={feature.index}>
                {feature.name}
              </Title>
              {feature.desc.map((desc, index) => (
                <Text key={index}>{desc}</Text>
              ))}
              {feature.name === 'Spellcasting' &&
                spellcasting.info.map((spellInfo) => (
                  <>
                    <Title order={4}>{spellInfo.name}</Title>
                    {spellInfo.desc.map((desc, index) => (
                      <Text key={index}>{desc}</Text>
                    ))}
                  </>
                ))}
              {feature.category === 'subclass' && (
                <ul>
                  {subclasses.map((subclass) => (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          width: '50%',
                          marginBottom: '1rem',
                        }}
                      >
                        <Link
                          href={{
                            pathname: '/classes/[class]/[subclass]',
                            query: {
                              class: router.query.index,
                              subclass: subclass.index,
                            },
                          }}
                          order={4}
                          key={subclass.index}
                        >
                          <a style={{ fontSize: 18, paddingRight: 150 }}>
                            {subclass.name} ({subclass.source_book})
                          </a>
                        </Link>
                      </div>
                      <Divider />
                    </>
                  ))}
                </ul>
              )}
            </>
          );
      })}
    </Container>
  );
}
export default Subclass;

export async function getServerSideProps({ params: { subclass } }) {
  await dbConnect();

  // Subclass
  const singleSubclass = await Subclasses.findOne({ index: subclass }).lean();
  singleSubclass._id = singleSubclass._id.toString();

  // Class Features
  const features = await (
    await Feature.find().lean()
  ).filter((feature) => feature.class.index === singleSubclass.class.index);

  features.forEach((feature) => {
    feature._id = feature._id.toString();
  });

  const classFeatures = [
    ...new Map(features.map((item) => [item.name, item])).values(),
  ];

  return { props: { singleSubclass, classFeatures } };
}
