import Image from 'next/image';
import { useState, useEffect } from 'react';

import Class from '../../models/class';
import Feature from '../../models/feature';

import dbConnect from '../../lib/dbConnect';
import { AspectRatio, Title, Text, Container } from '@mantine/core';

import ClassEquipment from '../../components/classes/ClassEquipment';
import ClassProficiencies from '../../components/classes/ClassProficiencies';
import ClassHitPoints from '../../components/classes/ClassHitPoints';
import ClassFeatures from '../../components/classes/ClassFeatures';

function SingleClass({ singleClass, classFeatures }) {
  const {
    index,
    hit_die,
    name,
    description,
    saving_throws,
    proficiencies,
    proficiency_choices,
    starting_equipment,
    starting_equipment_options,
    spellcasting,
  } = singleClass;

  const [armorProficiencies, setArmorProficiencies] = useState([]);
  const [weaponProficiencies, setWeaponProficiencies] = useState([]);
  const [toolProficiencies, setToolProficiencies] = useState([]);
  const [skillProficiencies, setSkillProficiencies] = useState([]);

  useEffect(() => {
    proficiencies.forEach((prof) => {
      if (prof.category === 'armor')
        return setArmorProficiencies((armorProficiencies) => [
          ...armorProficiencies,
          prof,
        ]);
      if (prof.category === 'weapon')
        return setWeaponProficiencies((weaponProficiencies) => [
          ...weaponProficiencies,
          prof,
        ]);
      return setToolProficiencies((toolProficiencies) => [
        ...toolProficiencies,
        prof,
      ]);
    });

    proficiency_choices.forEach((prof) => {
      if (prof.type !== 'instruments' || prof.type !== 'artisans_tools')
        return setSkillProficiencies(prof);
    });
  }, [proficiencies, proficiency_choices]);

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
      <Title order={2}>Class Features</Title>
      <Text>As a {index}, you gain the following class features.</Text>
      {/* Hit Points */}
      <ClassHitPoints hit_die={hit_die} index={index} />
      {/* Proficiencies */}
      <ClassProficiencies
        name={name}
        saving_throws={saving_throws}
        armorProficiencies={armorProficiencies}
        weaponProficiencies={weaponProficiencies}
        toolProficiencies={toolProficiencies}
        skillProficiencies={skillProficiencies}
      />
      {/* Equipment */}
      <ClassEquipment
        starting_equipment={starting_equipment}
        starting_equipment_options={starting_equipment_options}
      />
      {/* Class Features */}
      <ClassFeatures
        classFeatures={classFeatures}
        spellcasting={spellcasting}
      />
    </Container>
  );
}
export default SingleClass;

export async function getServerSideProps({ params }) {
  await dbConnect();

  const singleClass = await Class.findOne(params).lean();
  singleClass._id = singleClass._id.toString();

  const features = await (
    await Feature.find().lean()
  ).filter((feature) => feature.class.index === singleClass.index);

  features.forEach((feature) => {
    feature._id = feature._id.toString();
  });

  const classFeatures = [
    ...new Map(features.map((item) => [item.name, item])).values(),
  ];

  return { props: { singleClass, classFeatures } };
}
