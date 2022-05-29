import { Title, Text } from '@mantine/core';

function RaceFeatures({
  index,
  name,
  ability_bonuses,
  desc,
  racial_traits,
  source_book,
  subraceTraits,
}) {
  return (
    <div>
      <Title order={3}>{name}</Title>
      <Text size="sm">Source: {source_book}</Text>
      <Text>{desc}</Text>
      <Title order={4}>Ability Score Increase</Title>
      <Text>
        {index === 'human'
          ? 'Your ability scores each increase by 1.'
          : ability_bonuses
              .map(
                ({ bonus, ability_score }) => `+${bonus} ${ability_score.name}`
              )
              .join(', ')}
        {index === 'half-elf' &&
          ', and two other ability scores of your choice increase by 1.'}
      </Text>

      {racial_traits &&
        racial_traits.map((racial_trait) => (
          <>
            <Title order={4}>{racial_trait.name}</Title>
            {subraceTraits.map((rt) => {
              if (rt.index === racial_trait.index)
                return <Text>{rt.desc}</Text>;
            })}
          </>
        ))}
    </div>
  );
}
export default RaceFeatures;
