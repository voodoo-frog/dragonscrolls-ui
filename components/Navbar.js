import { useState, useRef } from 'react';
import {
  createStyles,
  Accordion,
  Autocomplete,
  Anchor,
  Badge,
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Header,
  Group,
  MediaQuery,
  Menu,
  Popover,
  Text,
} from '@mantine/core';

import { SiDungeonsanddragons as Logo } from 'react-icons/si';
import { AiOutlineSearch as Search } from 'react-icons/ai';
import { sorter } from '../lib/common';

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
  const sortedClasses = sorter(dndClasses);

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
                  size="xs"
                  control={
                    <Button
                      component="a"
                      href="/classes"
                      variant="subtle"
                      color="red"
                    >
                      Classes
                    </Button>
                  }
                  trigger="hover"
                  delay={200}
                >
                  <Menu.Item component="a" href="/classes">
                    Overview
                  </Menu.Item>
                  {sortedClasses && sortedClasses.length > 0
                    ? sortedClasses.map((c) => (
                        <>
                          <Divider my="xs" />
                          <Menu.Item
                            component="a"
                            key={c.index}
                            href={`/classes/${c.index}`}
                          >
                            {c.name}
                          </Menu.Item>
                        </>
                      ))
                    : null}
                </Menu>
                <Menu
                  size="xs"
                  control={
                    <Button
                      component="a"
                      href="/spells"
                      variant="subtle"
                      color="red"
                    >
                      Spells
                    </Button>
                  }
                  trigger="hover"
                  delay={200}
                >
                  <Menu.Item component="a" href="/spells">
                    All Spells
                  </Menu.Item>
                  <Divider my="xs" />{' '}
                  <Menu.Item component="a" href="/spells/school/abjuration">
                    Abjuration
                  </Menu.Item>
                  <Divider my="xs" />{' '}
                  <Menu.Item component="a" href="/spells/school/conjuration">
                    Conjuration
                  </Menu.Item>
                  <Divider my="xs" />{' '}
                  <Menu.Item component="a" href="/spells/school/divination">
                    Divination
                  </Menu.Item>
                  <Divider my="xs" />{' '}
                  <Menu.Item component="a" href="/spells/school/enchantment">
                    Enchantment
                  </Menu.Item>
                  <Divider my="xs" />{' '}
                  <Menu.Item component="a" href="/spells/school/evocation">
                    Evocation
                  </Menu.Item>
                  <Divider my="xs" />{' '}
                  <Menu.Item component="a" href="/spells/school/illusion">
                    Illusion
                  </Menu.Item>
                  <Divider my="xs" />{' '}
                  <Menu.Item component="a" href="/spells/school/necromancy">
                    Necromancy
                  </Menu.Item>
                  <Divider my="xs" />{' '}
                  <Menu.Item component="a" href="/spells/school/transmutation">
                    Transmutation
                  </Menu.Item>
                </Menu>
                <Button
                  component="a"
                  href="/races"
                  variant="subtle"
                  color="red"
                >
                  Races
                </Button>
                <Button>Backgrounds</Button>
                <Button>Equipment</Button>
                <Button>Basic Rules</Button>
                <Button>Monsters</Button>
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
        </Accordion>
        <Box sx={{ paddingLeft: 15, paddingTop: 12 }}>
          <Anchor href="/spells" sx={{ color: '#000' }}>
            Spells
          </Anchor>
          <Anchor href="/races" sx={{ color: '#000' }}>
            Races
          </Anchor>
        </Box>
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
