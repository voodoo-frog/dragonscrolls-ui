import Link from 'next/link';
import { useRouter } from 'next/router';
import { Title, Text, Divider } from '@mantine/core';

function ClassFeatures({ classFeatures, subclasses }) {
  const router = useRouter();
  return (
    <div>
      {classFeatures.map((feature) => {
        if (feature.subclass || feature.name === 'Spellcasting') return;
        return (
          <div key={feature.index}>
            <Title order={3}>{feature.name}</Title>
            {feature.desc.map((desc, index) => (
              <Text key={index}>{desc}</Text>
            ))}
            {feature.category === 'subclass' && (
              <ul>
                {subclasses.map((subclass) => (
                  <div key={subclass.index}>
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
                  </div>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
export default ClassFeatures;
