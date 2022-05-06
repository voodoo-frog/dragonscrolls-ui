import Image from 'next/image';
import { useState, useEffect } from 'react';

import Race from '../../models/race';

import dbConnect from '../../lib/dbConnect';
import { AspectRatio, Title, Text, Container } from '@mantine/core';

import RaceFeatures from '../../components/races/RaceFeatures';

function SingleRace({ race }) {
  const {
    index,
    name,
    speed,
    ability_bonuses,
    alignment,
    age,
    size_description,
    starting_proficiencies,
    starting_proficiency_options,
    language_desc,
    traits,
    subraces,
    source_book,
  } = race;

  // useEffect(() => {
  // }, []);

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
      <Text size="sm">Source: {source_book}</Text>
      <Title order={2}>{name} Features</Title>
      {/* General Traits */}
      <RaceFeatures
        index={index}
        ability_bonuses={ability_bonuses}
        age={age}
        alignment={alignment}
        size_description={size_description}
        speed={speed}
        language_desc={language_desc}
      />
      {/* Race Specific Traits */}
    </Container>
  );
}
export default SingleRace;

export async function getServerSideProps({ params }) {
  await dbConnect();

  // Race
  const race = await Race.findOne(params).lean();
  race._id = race._id.toString();

  // Subraces
  // const subclasses = await (
  //   await Subclass.find().lean()
  // ).filter((subclass) => subclass.class.index === race.index);

  // subclasses.forEach((feature) => {
  //   feature._id = feature._id.toString();
  // });
  return { props: { race } };
}
