import { useState } from 'react';
import {
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
  Text,
} from '@mantine/core';

import { SiDungeonsanddragons as Logo } from 'react-icons/si';
import { AiOutlineSearch as Search } from 'react-icons/ai';

import { sorter } from '../lib/common';

import styles from '../styles/Navbar.module.css';

function Navbar({ dndClasses }) {
  const [opened, setOpened] = useState(false);
  const sortedClasses = sorter(dndClasses);

  return (
    <>
      <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
        <Group position="apart" className={styles.header}>
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
            color="#fff"
            opened={opened}
            onClick={() => setOpened((prevState) => !prevState)}
          />
        </Group>
      </MediaQuery>

      <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
        <Header className={styles.header} height={70} px={16} mb={60}>
          <Group position="apart">
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
              <Group ml={50} spacing={5}>
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
                    All Classes
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
                  {sortedClasses && sortedClasses.length > 0
                    ? sortedClasses
                        .filter((classObj) => classObj.spellcasting)
                        .map((c) => (
                          <>
                            <Divider my="xs" />
                            <Menu.Item
                              component="a"
                              key={c.index}
                              href={`/spells/${c.index}`}
                            >
                              {c.name}
                            </Menu.Item>
                          </>
                        ))
                    : null}
                </Menu>
                <Button
                  component="a"
                  href="/races"
                  variant="subtle"
                  color="red"
                >
                  Races
                </Button>
                <Button
                  component="a"
                  href="/backgrounds"
                  variant="subtle"
                  color="red"
                >
                  Backgrounds
                </Button>
                <Button
                  component="a"
                  href="/equipment"
                  variant="subtle"
                  color="red"
                >
                  Equipment
                </Button>
                <Button
                  disabled
                  component="a"
                  href="/rules"
                  variant="subtle"
                  color="red"
                >
                  Basic Rules
                </Button>
                <Button
                  disabled
                  // component="a"
                  href="/monsters"
                  variant="subtle"
                  color="red"
                >
                  Monsters
                </Button>
              </Group>
              <Autocomplete
                disabled
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
          </Group>
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
        <Anchor href="/" className={styles.sideNavLink}>
          Home
        </Anchor>
        <Divider my="xs" />
        <Accordion iconPosition="right" className={styles.accordion}>
          <Accordion.Item label="Classes">
            <Anchor className={styles.anchor} href="/classes">
              All Classes
            </Anchor>
            {dndClasses && dndClasses.length > 0
              ? dndClasses.map((c) => (
                  <>
                    <Divider my="xs" />
                    <Anchor
                      key={c.index}
                      className={styles.anchor}
                      href={`/classes/${c.index}`}
                    >
                      {c.name}
                    </Anchor>
                  </>
                ))
              : null}
          </Accordion.Item>
          <Accordion.Item label="Spells">
            <Anchor className={styles.anchor} href="/spells">
              All Spells
            </Anchor>
            {sortedClasses && sortedClasses.length > 0
              ? sortedClasses
                  .filter((classObj) => classObj.spellcasting)
                  .map((c) => (
                    <>
                      <Divider my="xs" />
                      <Anchor
                        key={c.index}
                        className={styles.anchor}
                        href={`/spells/${c.index}`}
                      >
                        {c.name}
                      </Anchor>
                    </>
                  ))
              : null}
          </Accordion.Item>
        </Accordion>
        <Box className={styles.sideNavItem}>
          <Anchor href="/races">Races</Anchor>
        </Box>
        <Divider my="xs" />
        <Box className={styles.sideNavItem}>
          <Anchor href="/backgrounds">Backgrounds</Anchor>
        </Box>
        <Divider my="xs" />
        <Box className={styles.sideNavItem}>
          <Anchor href="/equipment">Equipment</Anchor>
        </Box>
        <Divider my="xs" />
        <Box className={styles.sideNavItem}>
          <Anchor href="/rules">Basic Rules</Anchor>
        </Box>
        <Divider my="xs" />
        <Box className={styles.sideNavItem}>
          <Anchor href="/monsters">Monsters</Anchor>
        </Box>
        <Divider my="xs" />
        <Box className={styles.sideNavItem}>
          <Anchor href="/login">Login</Anchor>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
