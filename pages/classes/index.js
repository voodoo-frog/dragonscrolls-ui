import Class from '../../models/class';
import dbConnect from '../../lib/dbConnect';
import Image from 'next/image';
import {
  Card,
  Text,
  Title,
  Badge,
  Button,
  Group,
  useMantineTheme,
} from '@mantine/core';

function Classes({ classes }) {
  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <div>
      <h1>Classes</h1>
      {classes.map(
        ({ _id, index, name, hit_die, description, primary_ability }) => {
          console.log('PRIMARY', primary_ability);
          const abilities = primary_ability.map((ability) => ability.name);
          console.log('abilities', abilities);
          const primaryAbilities = abilities.join(
            index === 'fighter' ? ' or ' : ' & '
          );
          return (
            <Card key={index} shadow="sm" p="lg">
              <Card.Section component="a" href={`/classes/${index}`}>
                <Image
                  src={`/images/${index}.png`}
                  height={450}
                  width={350}
                  alt={`${name} class`}
                  objectFit="cover"
                  objectPosition="top"
                />
              </Card.Section>

              <Group
                position="apart"
                style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
              >
                <Title order={3}>{name}</Title>
                <Badge color="red" variant="filled" size="lg">
                  d{hit_die}
                </Badge>
              </Group>
              <Text weight={500}>Primary Abilities: {primaryAbilities}</Text>

              <Text
                size="sm"
                style={{ color: secondaryColor, lineHeight: 1.5 }}
              >
                {description}
              </Text>

              <Button
                variant="filled"
                color="red"
                fullWidth
                style={{ marginTop: 14 }}
              >
                View {name} Details
              </Button>
            </Card>
          );
        }
      )}
    </div>
  );
}
export default Classes;

export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const result = await Class.find({});
  const classes = result.map((doc) => {
    const dndClass = doc.toObject();
    dndClass._id = dndClass._id.toString();
    return dndClass;
  });

  return { props: { classes: classes } };
}
