import Link from 'next/link';
import { useRouter } from 'next/router';
import { Title, Text, Divider } from '@mantine/core';

function RaceFeatures({
  index,
  ability_bonuses,
  ability_bonus_options,
  age,
  alignment,
  language_desc,
  size_description,
  speed,
}) {
  const router = useRouter();
  console.log('ability_bonus_options:', ability_bonus_options);
  return (
    <div>
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

      <Title order={4}>Age</Title>
      <Text>{age}</Text>

      <Title order={4}>Size</Title>
      <Text>{size_description}</Text>

      <Title order={4}>Speed</Title>
      <Text>Your base walking speed is {speed} feet.</Text>

      <Title order={4}>Languages</Title>
      <Text>{language_desc}</Text>

      <Title order={4}>Alignment</Title>
      <Text>{alignment}</Text>
    </div>
  );
}
export default RaceFeatures;
