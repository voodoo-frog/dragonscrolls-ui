import { Title, Text } from '@mantine/core';

function ClassHitPoints({ index, hit_die }) {
  return (
    <>
      <Title order={4}>Hit Points</Title>
      <Text weight={700}>
        Hit Points Hit Dice:{' '}
        <Text weight={400} component="span">
          1d{hit_die} per {index} level
        </Text>
      </Text>
      <Text weight={700}>
        Hit Points at 1st Level:{' '}
        <Text weight={400} component="span">
          {hit_die} + your Constitution modifier
        </Text>
      </Text>
      <Text weight={700}>
        Hit Points at Higher Levels:{' '}
        <Text weight={400} component="span">
          1d{hit_die} (or {hit_die / 2 + 1}) + your Constitution modifier per{' '}
          {index} level after 1st
        </Text>
      </Text>
    </>
  );
}
export default ClassHitPoints;
