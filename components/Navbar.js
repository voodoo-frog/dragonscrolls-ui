import { useState } from 'react';
import {
  createStyles,
  Accordion,
  Autocomplete,
  Anchor,
  Badge,
  Burger,
  Button,
  Divider,
  Drawer,
  Header,
  Group,
  MediaQuery,
  Menu,
  Text,
} from '@mantine/core';
import { SiDungeonsanddragons as Logo } from 'react-icons/si';
import { AiOutlineSearch as Search } from 'react-icons/ai';

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  menuBtn: {
    color: 'red',
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

function Navbar({ dndClasses }) {
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();

  return (
    <>
      <MediaQuery largerThan="md" styles={{ display: 'none' }}>
        <Group position="apart" style={{ padding: 10 }}>
          <Anchor
            href="/"
            style={{
              color: 'red',
              textDecorationLine: 'none',
              display: 'flex',
              alignContent: 'center',
            }}
          >
            <Logo size={50} />
            <Text
              variant="gradient"
              gradient={{ from: 'red', to: 'black', deg: 90 }}
              size="xl"
              transform="uppercase"
              weight={700}
              style={{ alignSelf: 'center', marginLeft: 10 }}
            >
              Dragon Scrolls
            </Text>
          </Anchor>
          <Burger
            opened={opened}
            onClick={() => setOpened((prevState) => !prevState)}
          />
        </Group>
      </MediaQuery>

      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
        <Header height={56} className={classes.header} mb={60}>
          <div className={classes.inner}>
            <Group>
              <Anchor
                href="/"
                style={{
                  color: 'red',
                  textDecorationLine: 'none',
                  display: 'flex',
                  alignContent: 'center',
                }}
              >
                <Logo size={50} />
                <Text
                  variant="gradient"
                  gradient={{ from: 'red', to: 'black', deg: 90 }}
                  size="xl"
                  transform="uppercase"
                  weight={700}
                  style={{ alignSelf: 'center', marginLeft: 10 }}
                >
                  Dragon Scrolls
                </Text>
              </Anchor>
            </Group>

            <Group>
              <Group ml={50} spacing={5} className={classes.links}>
                <Menu
                  control={
                    <Button variant="subtle" color="red" href="/classes">
                      Classes
                    </Button>
                  }
                  trigger="hover"
                  delay={500}
                >
                  <Anchor href="/classes" className={classes.link}>
                    Overview
                  </Anchor>
                  {dndClasses && dndClasses.length > 0
                    ? dndClasses
                        .sort((nameA, nameB) => nameA.name - nameB.name)
                        .map((c) => (
                          <>
                            <Divider my="xs" />
                            <Anchor
                              className={classes.link}
                              key={c.index}
                              href={`/classes/${c.index}`}
                            >
                              {c.name}
                            </Anchor>
                          </>
                        ))
                    : null}
                </Menu>
                <Button href="/classes">Spells</Button>
                <Button href="/classes">Races</Button>
                <Button href="/classes">Backgrounds</Button>
                <Button href="/classes">Equipment</Button>
                <Button href="/classes">Basic Rules</Button>
                <Button href="/classes">Monsters</Button>
              </Group>
              <Autocomplete
                className={classes.search}
                placeholder="Search"
                icon={<Search size={16} />}
                data={[
                  'React',
                  'Angular',
                  'Vue',
                  'Next.js',
                  'Riot.js',
                  'Svelte',
                  'Blitz.js',
                ]}
              />
            </Group>
          </div>
        </Header>
      </MediaQuery>
      <Drawer
        position="right"
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Badge color="red">v1.0.0</Badge>}
        padding="sm"
        size="sm"
      >
        <Anchor href="/" sx={{ paddingLeft: 15, color: '#000' }}>
          Home
        </Anchor>
        <Divider my="xs" />
        <Accordion iconPosition="right">
          <Accordion.Item label="Classes">
            <Anchor href="/classes">Overview</Anchor>
            {dndClasses && dndClasses.length > 0
              ? dndClasses.map((c) => (
                  <>
                    <Divider my="xs" />
                    <Anchor key={c.index} href={`/classes/${c.index}`}>
                      {c.name}
                    </Anchor>
                  </>
                ))
              : null}
          </Accordion.Item>
          <Accordion.Item label="Spells">
            <Anchor href="/spells">All spells</Anchor>
          </Accordion.Item>
        </Accordion>
        <Button
          variant="subtle"
          size="md"
          href="/login"
          sx={{ paddingLeft: 15, color: '#000' }}
        >
          Login
        </Button>
        <Divider my="xs" />
        <Button
          variant="subtle"
          size="md"
          href="/login"
          sx={{ paddingLeft: 15, color: '#000' }}
        >
          Login
        </Button>
      </Drawer>
    </>
  );
}

export default Navbar;
