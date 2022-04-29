import { Title, Text } from '@mantine/core';

function ClassProficiencies({
  name,
  armorProficiencies,
  weaponProficiencies,
  toolProficiencies,
  skillProficiencies,
  saving_throws,
}) {
  const armors = armorProficiencies.length
    ? armorProficiencies.map((armor) => armor.name).join(', ')
    : 'None';

  const weapons = weaponProficiencies.length
    ? weaponProficiencies.map((weapon) => weapon.name).join(', ')
    : 'None';

  let tools = toolProficiencies.length
    ? toolProficiencies.map((tool) => tool.name).join(',  ')
    : 'None';

  const skills = skillProficiencies.from
    ? skillProficiencies.from
        .map((skill) => skill.name.substring(7))
        .join(',  ')
    : 'None';

  const throws = saving_throws.map((save) => save.name);
  const savingThrows = throws.join(', ');

  if (name === 'Bard') tools = 'Three musical instruments of your choice';
  if (name === 'Monk')
    tools = 'One type of artisan’s tools or one musical instrument';

  return (
    <>
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
          {tools}
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
    </>
  );
}
export default ClassProficiencies;
