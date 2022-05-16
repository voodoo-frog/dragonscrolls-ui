import Class from '../../models/class';
import dbConnect from '../../lib/dbConnect';
import Image from 'next/image';
import {
  useMantineTheme,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Text,
  Title,
} from '@mantine/core';

function Classes({ classes }) {
  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <div style={{ margin: 20 }}>
      <h1>Classes</h1>
      <Grid>
        {classes.map(({ index, name, hit_die, brief, primary_ability }) => {
          const abilities = primary_ability.map((ability) => ability.name);
          const primaryAbilities = abilities.join(
            index === 'fighter' ? ' or ' : ' & '
          );
          return (
            <Grid.Col key={index} md={6} lg={4}>
              <Card shadow="sm" p="lg">
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
                  {brief}
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
            </Grid.Col>
          );
        })}
      </Grid>
    </div>
  );
}
export default Classes;

export async function getServerSideProps() {
  await dbConnect();

  /* Classes */
  const result = await Class.find({});
  const res = result.map((doc) => {
    const dndClass = doc.toObject();
    dndClass._id = dndClass._id.toString();
    return dndClass;
  });
  const classes = res.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return { props: { classes: classes } };
}
