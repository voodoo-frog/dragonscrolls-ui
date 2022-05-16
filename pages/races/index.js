import Race from '../../models/race';
import dbConnect from '../../lib/dbConnect';
import Image from 'next/image';
import {
  useMantineTheme,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Text,
  Title,
} from '@mantine/core';

function Races({ races }) {
  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <div style={{ margin: 20 }}>
      <h1>Races</h1>
      <Divider mb={30} />
      <Grid align="stretch">
        {races.map(({ index, name, brief, traits }) => {
          return (
            <Grid.Col key={index} md={6} lg={4}>
              <Card shadow="sm" p="lg">
                <Card.Section component="a" href={`/races/${index}`}>
                  <Image
                    src={`/images/${index}.png`}
                    height={450}
                    width={350}
                    alt={`${name} race`}
                    objectFit="cover"
                    objectPosition="top"
                  />
                </Card.Section>

                <Group
                  position="apart"
                  style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
                >
                  <Title order={3}>{name}</Title>
                </Group>
                <Container px={0} style={{ height: 50 }}>
                  <Text size="sm">
                    <strong>Traits:</strong>{' '}
                    {index === 'human'
                      ? '+1 to All Ability Scores, Extra Language'
                      : traits.map((trait) => trait.name).join(', ')}
                  </Text>
                </Container>
                <Container px={0} style={{ height: 100 }}>
                  <Text
                    size="md"
                    weight={500}
                    style={{ color: secondaryColor, lineHeight: 1.3 }}
                  >
                    {brief}
                  </Text>
                </Container>

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
export default Races;

export async function getServerSideProps() {
  await dbConnect();

  /* Races */
  const result = await Race.find({});
  const res = result.map((doc) => {
    const race = doc.toObject();
    race._id = race._id.toString();
    return race;
  });
  const races = res.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return { props: { races: races } };
}
