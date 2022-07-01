import { Title, Text } from '@mantine/core';

function ClassSpellCastingFeatures({ spellDetails, spellcasting }) {
  const { desc } = spellDetails;

  return (
    <>
      <Title order={3}>Spellcasting</Title>
      {desc.map((desc, index) => (
        <Text key={index}>{desc}</Text>
      ))}
      {spellcasting.info.map((spellInfo) => (
        <div key={spellInfo.name}>
          <Title order={4}>{spellInfo.name}</Title>
          {spellInfo.desc.map((desc, index) => (
            <Text key={index}>{desc}</Text>
          ))}
        </div>
      ))}
    </>
  );
}
export default ClassSpellCastingFeatures;
