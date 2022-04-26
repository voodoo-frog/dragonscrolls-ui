import { useState } from 'react';
import {
  Accordion,
  Anchor,
  Badge,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  MediaQuery,
  Text,
} from '@mantine/core';
import { SiDungeonsanddragons } from 'react-icons/si';

function Navbar({ dndClasses }) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
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
            <SiDungeonsanddragons size={50} />
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

      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        {/* Add top nav here */}
        <Text>Top Nav</Text>
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
