import { Title, Text } from '@mantine/core';

function ClassFeatures({ classFeatures, spellcasting }) {
  return (
    <div>
      {classFeatures.map((feature) => {
        if (feature.subclass) return;
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
          </>
        );
      })}
    </div>
  );
}
export default ClassFeatures;
