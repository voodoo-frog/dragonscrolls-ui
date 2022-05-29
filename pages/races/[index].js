import Image from 'next/image';

import Race from '../../models/race';
import Subrace from '../../models/subrace';
import Trait from '../../models/trait';

import dbConnect from '../../lib/dbConnect';
import { AspectRatio, Title, Text, Container } from '@mantine/core';

import RaceFeatures from '../../components/races/RaceFeatures';
import SubraceFeatures from '../../components/subraces/SubraceFeatures';

function SingleRace({ race, raceTraits, raceSubraces, subraceTraits }) {
  const {
    index,
    name,
    speed,
    ability_bonuses,
    ability_bonus_options,
    alignment,
    age,
    size_description,
    language_desc,
    traits,
    subraces,
    source_book,
  } = race;

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
        ability_bonus_options={ability_bonus_options}
        age={age}
        alignment={alignment}
        size_description={size_description}
        speed={speed}
        language_desc={language_desc}
      />
      {/* Race Specific Traits */}
      {traits &&
        traits.map((trait) => (
          <>
            <Title order={4}>{trait.name}</Title>
            {raceTraits.map((rt) => {
              if (rt.index === trait.index) return <Text>{rt.desc}</Text>;
            })}
          </>
        ))}
      {/* Subrace Features */}
      {subraces &&
        subraces.map((subrace) => {
          const sr = raceSubraces.find((rs) => rs.index === subrace.index);

          return (
            <SubraceFeatures
              key={sr.index}
              name={sr.name}
              index={sr.index}
              ability_bonuses={sr.ability_bonuses}
              desc={sr.desc}
              languages={sr.languages}
              language_options={sr.language_options}
              racial_traits={sr.racial_traits}
              source_book={sr.source_book}
              starting_proficiencies={sr.starting_proficiencies}
              subraceTraits={subraceTraits}
            />
          );
        })}
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
  const subraces = await Subrace.find({}).lean();
  const raceSubraces = subraces.filter((sr) => {
    if (sr.race.index === params.index) {
      sr._id = sr._id.toString();
      return sr;
    }
  });

  // Traits
  const traitsArr = await (
    await Trait.find().lean()
  ).filter((trait) => (trait._id = trait._id.toString()));

  const raceTraits = traitsArr.filter((trait) =>
    trait.races.some((r) => r.index === race.index)
  );

  // Subrace Traits
  const subraceTraits = raceSubraces.map((subrace) => {
    return traitsArr.filter((trait) => {
      return trait.subraces.some((c) => c.index === subrace.index);
    });
  });

  return {
    props: {
      race,
      raceTraits,
      raceSubraces,
      subraceTraits: subraceTraits[0] || null,
    },
  };
}
