import Image from 'next/image';
import { useState, useEffect } from 'react';

import Class from '../../models/class';
import dbConnect from '../../lib/dbConnect';
import { AspectRatio, List, Title, Text, Container } from '@mantine/core';

function SingleClass({ singleClass }) {
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
  } = singleClass;

  const [armorProficiencies, setArmorProficiencies] = useState([]);
  const [weaponProficiencies, setWeaponProficiencies] = useState([]);
  const [toolProficiencies, setToolProficiencies] = useState([]);
  const [skillProficiencies, setSkillProficiencies] = useState([]);
  const [artisanToolProficiencies, artisanTetToolProficiencies] = useState([]);
  const [instrumentProficiencies, setInstrumentProficiencies] = useState([]);

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
      if (prof.type === 'instruments') return setInstrumentProficiencies(prof);
      if (prof.type === 'artisans_tools')
        return artisanTetToolProficiencies(prof);
      return setSkillProficiencies(prof);
    });
  }, [proficiencies, proficiency_choices]);

  const armors = armorProficiencies.length
    ? armorProficiencies.map((armor) => armor.name).join(', ')
    : 'None';

  const weapons = weaponProficiencies.length
    ? weaponProficiencies.map((weapon) => weapon.name).join(', ')
    : 'None';

  const tools = toolProficiencies.length
    ? toolProficiencies.map((tool) => tool.name).join(',  ')
    : 'None';

  const skills = skillProficiencies.from
    ? skillProficiencies.from
        .map((skill) => skill.name.substring(7))
        .join(',  ')
    : 'None';

  const throws = saving_throws.map((save) => save.name);
  const savingThrows = throws.join(', ');

  const equipment = starting_equipment.map(
    ({ quantity, equipment_option, equipment }) => {
      if (equipment_option) {
        const { choose } = equipment_option;
        const item =
          choose === 1
            ? `any ${equipment_option.equipment.name}`
            : `any ${choose} ${equipment_option.equipment.name}s`;
        return item;
      }
      return quantity === 1
        ? `${quantity} ${equipment.name}`
        : `${quantity} ${equipment.name}s`;
    }
  );

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
      {/* Proficiencies */}
      <Title order={4}>Proficiencies</Title>
      <Text weight={700}>
        Armor:{' '}
        <Text weight={400} component="span">
          {armors}
        </Text>
      </Text>
      <Text weight={700}>
        Weapons:{' '}
        <Text weight={400} component="span">
          {weapons}
        </Text>
      </Text>
      <Text weight={700}>
        Tools:{' '}
        <Text weight={400} component="span">
          {name === 'Bard' ? 'Three musical instruments of your choice' : tools}
        </Text>
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
          {name === 'Bard'
            ? 'Choose any three'
            : `Choose ${skillProficiencies.choose} from ${skills}`}
        </Text>
      </Text>
      {/* Equipment */}
      <Title order={4}>Equipment</Title>{' '}
      <Text>
        You start with the following equipment, in addition to the equipment
        granted by your background:
      </Text>
      <List withPadding>
        {starting_equipment_options.map((option) => {
          const items = option.from.map((opt) => {
            if (opt instanceof Array) {
              const optBank = opt.map((item) => {
                const { quantity, equipment, equipment_option } = item;
                if (equipment_option) {
                  const { choose } = equipment_option;
                  return choose === 1
                    ? `any ${equipment_option.equipment.name}`
                    : `any ${choose} ${equipment_option.equipment.name}s`;
                }
                return quantity === 1
                  ? equipment.name
                  : `${quantity} ${equipment.name}s`;
              });
              return (
                optBank.slice(0, -1).join(', ') + ' and ' + optBank.slice(-1)
              );
            }
            const { quantity, equipment, equipment_option } = opt;
            if (equipment_option) {
              const { choose } = equipment_option;
              return choose === 1
                ? `any ${equipment_option.equipment.name}`
                : `any ${choose} ${equipment_option.equipment.name}s`;
            }
            let item =
              quantity === 1 && equipment
                ? `${quantity} ${equipment.name}`
                : `${quantity} ${equipment.name}s`;
            if (opt.prerequisites) item = `${item} (if proficient)`;
            return item;
          });
          return (
            <List.Item key={items.join(', ')}>
              {items.length === 2
                ? `(a) ${items[0]} or (b) ${items[1]}`
                : `(a) ${items[0]} (b) ${items[1]} or (c) ${items[2]}`}
            </List.Item>
          );
        })}

        <List.Item key={index}>
          {equipment.slice(0, -1).join(', ') + ' and ' + equipment.slice(-1)}
        </List.Item>
      </List>
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
