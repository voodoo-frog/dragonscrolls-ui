import Image from 'next/image';

import Class from '../../models/class';
import dbConnect from '../../lib/dbConnect';
import { AspectRatio, Title, Text, Container } from '@mantine/core';

function SingleClass({ singleClass }) {
  console.log('DND CLASS', singleClass);
  const {
    index,
    hit_die,
    name,
    description,
    saving_throws,
    proficiency_choices,
  } = singleClass;

  const throws = saving_throws.map((st) => st.name);
  const savingThrows = throws.join(', ');

  return (
    <Container px="md">
      <Title order={1}>{name}</Title>
      <AspectRatio ratio={720 / 1080} sx={{ maxWidth: 300 }} mx="auto">
        <Image
          src={`/images/${index}.png`}
          layout="fill"
          alt={`${name} class`}
          objectFit="cover"
          objectPosition="top"
        />
      </AspectRatio>
      <Text>{description}</Text>
      <Title order={3}>Class Features</Title>
      <Text>As a {index}, you gain the following class features.</Text>
      {/* Hit Points */}
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
      {/* Proficiencies */}
      <Title order={3}>Proficiencies</Title>
      <Text weight={700}>
        Armor: <Text weight={400} component="span"></Text>
      </Text>
      <Text weight={700}>
        Weapons: <Text weight={400} component="span"></Text>
      </Text>
      <Text weight={700}>
        Tools: <Text weight={400} component="span"></Text>
      </Text>
      <Text weight={700}>
        Saving Throws:{' '}
        <Text weight={400} component="span">
          {savingThrows}
        </Text>
      </Text>
      <Text weight={700}>
        Skills:{' '}
        <Text weight={400} component="span">
          Choose {} skills from
        </Text>
      </Text>
    </Container>
  );
}
export default SingleClass;

export async function getServerSideProps({ params }) {
  await dbConnect();

  const singleClass = await Class.findOne(params).lean();
  singleClass._id = singleClass._id.toString();

  return { props: { singleClass } };
}
