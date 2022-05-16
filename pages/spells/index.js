import { useState, useEffect } from 'react';

import Class from '../../models/class';
import Spell from '../../models/spell';
import MagicSchool from '../../models/magic_school';

import styles from '../../styles/spells.module.css';

import dbConnect from '../../lib/dbConnect';

import Image from 'next/image';

import {
  useMantineTheme,
  Accordion,
  Avatar,
  Button,
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  Pagination,
  Table,
  Text,
  TextInput,
  Title,
  Stack,
} from '@mantine/core';

import { Remarkable } from 'remarkable';
const md = new Remarkable('full', {
  html: true,
  typographer: true,
});

function Spells({ spells, spellCasters, schools }) {
  const theme = useMantineTheme();
  const [name, setName] = useState('');
  const [level, setLevel] = useState();
  const [school, setSchool] = useState([]);
  const [castingTime, setCastingTime] = useState([]);
  const [activePage, setPage] = useState(1);

  const [classFilter, setClassFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [filtered, setFiltered] = useState([...spells]);

  const handleFilterByCategory = () => {
    if (spells.length > 0) {
      let filters = spells;
      if (name.length) {
        filters = filters.filter((spell) =>
          spell.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      if (level !== undefined) {
        filters = filters.filter((spell) => spell.level === level);
      }
      if (school.length) {
        filters = filters.filter((spell) => school.includes(spell.school.name));
      }
      if (castingTime.length) {
        const lowerCaseCastingTimes = castingTime.map((time) =>
          time.toLowerCase()
        );
        filters = filters.filter((spell) =>
          lowerCaseCastingTimes.includes(spell.casting_time.toLowerCase())
        );
      }
      return setCategoryFilter(filters);
      // return setFiltered(filters);
    }
  };

  const handleFilterByClass = (className) => {
    if (classFilter.includes(className)) {
      setClassFilter(classFilter.filter((c) => c !== className));
    } else {
      setClassFilter([...classFilter, className]);
    }
  };

  const handleFilterReset = () => {
    setName('');
    setLevel(undefined);
    setSchool([]);
    setCastingTime([]);
    setClassFilter([]);
    setCategoryFilter([]);
    setFiltered(spells);
  };

  function AccordionLabel({ school, name, level }) {
    let lvl = `${level}th level`;

    if (level === 0) lvl = 'Cantrip';
    if (level === 1) lvl = '1st level';
    if (level === 2) lvl = '2nd level';
    if (level === 3) lvl = '3rd level';
    return (
      <Group noWrap>
        <Avatar src={`/images/${school.index}.png`} radius="xl" />
        <Group sx={{ width: '100%' }}>
          <div>
            <Text>{name}</Text>
            <Text size="sm" color="dimmed" weight={400}>
              {lvl}
            </Text>
          </div>
        </Group>
      </Group>
    );
  }

  useEffect(() => {
    let spellList = categoryFilter.length ? categoryFilter : filtered;

    if (classFilter.length) {
      spellList = spellList.filter((spell) => {
        const classes = spell.classes.map((c) => c.name);
        return classFilter.some((c) => classes.includes(c));
      });
    }
    // console.log('filtered list before category filter', spellList.length);
    // if (categoryFilter.length) {
    //   console.log('category list', categoryFilter);
    //   console.log('spell list', spellList);
    //   spellList = categoryFilter.some((c) => spellList.includes(c));
    // }

    // console.log('filtered list after category filter', spellList.length);
    return setFiltered(spellList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classFilter, filtered]);

  return (
    <div style={{ margin: 20 }}>
      <h1>All Spells</h1>
      <Divider mb={30} />
      <Grid grow>
        {spellCasters.map((caster) => (
          <Grid.Col
            xs={6}
            md={4}
            lg={1}
            key={caster.index}
            className={styles.casterContainer}
            component="a"
            style={{
              opacity: classFilter.includes(caster.name) ? 1 : 0.5,
            }}
            onClick={() => handleFilterByClass(caster.name)}
          >
            <Image
              src={`/images/${caster.index}-emblem-color.jpeg`}
              width={100}
              height={100}
              alt={caster.name}
              className={styles.casterImage}
              style={{
                borderRadius: '50%',
                margin: '0 auto',
                display: 'block',
                paddingBottom: 20,
              }}
            />
            <Text size="sm" weight={700}>
              {caster.name}
            </Text>
          </Grid.Col>
        ))}
      </Grid>

      <Box mx="auto">
        <div className={styles.form}>
          <Group className={styles.formGroup} grow>
            <TextInput
              value={name}
              label="Spell Name"
              placeholder="Search spell names..."
              radius="xl"
              onChange={(e) => setName(e.target.value)}
            />
            <NumberInput
              value={level}
              min={0}
              max={9}
              hideControls
              label="Spell Level"
              placeholder="Select spell levels..."
              radius="xl"
              onChange={(lvl) => setLevel(lvl)}
            />
            <MultiSelect
              clearable
              data={schools.map((school) => school.name)}
              label="Spell School"
              placeholder="Select spell schools..."
              searchable
              nothingFound="Nothing found"
              radius="xl"
              onChange={setSchool}
            />
            <MultiSelect
              clearable
              data={[
                '1 Action',
                '1 Bonus Action',
                '1 Reaction',
                '1 Minute',
                '10 Minutes',
                '1 Hour',
                '8 Hours',
                '12 Hours',
                '24 Hours',
              ]}
              label="Casting Time"
              placeholder="Select casting times..."
              searchable
              nothingFound="Nothing found"
              radius="xl"
              onChange={setCastingTime}
            />
            <Stack>
              <Button
                type="submit"
                size="md"
                sx={{ alignSelf: 'center' }}
                onClick={handleFilterByCategory}
              >
                Filter Spells
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="subtle"
                sx={{ alignSelf: 'center' }}
                onClick={handleFilterReset}
              >
                Reset Filters
              </Button>
            </Stack>
          </Group>
        </div>
      </Box>

      <Box>
        <Accordion iconPosition="right">
          {filtered.length === 0 ? (
            <Accordion.Item label="No spells to display"></Accordion.Item>
          ) : (
            filtered
              .map((spell) => (
                <Accordion.Item
                  key={spell.name}
                  label={<AccordionLabel {...spell} />}
                >
                  <Grid grow>
                    <Grid.Col span={3}>
                      <strong>Level</strong>
                      <br />
                      {spell.level === 0 ? 'Cantrip' : spell.level}
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <strong>Casting Time</strong>
                      <br />
                      {spell.casting_time}
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <strong>Range / Area</strong>
                      <br />
                      {spell.range}
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <strong>Components</strong>
                      <br />
                      {spell.components.join(', ')}
                      {spell.components.includes('M') && ' *'}
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <strong>Duration</strong>
                      <br />
                      {spell.duration}
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <strong>School</strong>
                      <br />
                      {spell.school.name}
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <strong>Attack / Save</strong>
                      <br />
                      {spell.attack_save}
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <strong>Damage / Effect</strong>
                      <br />
                      {spell.damage &&
                        spell.damage.damage_type &&
                        spell.damage.damage_type.name}
                    </Grid.Col>
                  </Grid>
                  <Divider my="md" />
                  {spell.desc.map((descItem, index) => {
                    if (descItem instanceof Array) {
                      const rows = [];
                      const cols = [];
                      descItem.map((item) => {
                        const rowGroup = [];
                        Object.entries(item).map(([key, value]) => {
                          rowGroup.push(value);
                          !cols.includes(key) && cols.push(key);
                        });
                        rows.push(rowGroup);
                      });

                      return (
                        <Table verticalSpacing="sm">
                          <thead>
                            <tr>
                              {cols.map((col, i) => (
                                <th key={i}>{col.toUpperCase()}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, i) => (
                              <tr key={i}>
                                {row.map((r, j) => (
                                  <td key={`${i}_${j}`}>{r}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      );
                    }
                    return (
                      <div
                        key={index}
                        dangerouslySetInnerHTML={{
                          __html: md.render(descItem),
                        }}
                      />
                    );
                  })}
                  <Text>
                    <strong>Classes:</strong>{' '}
                    {spell.classes.map((c) => c.name).join(', ')}
                  </Text>
                  {spell.components.includes('M') && (
                    <Text size="xs" weight="bold">
                      * {spell.material}
                    </Text>
                  )}
                </Accordion.Item>
              ))
              .filter((spell) => {
                return true;
              })
              .slice((activePage - 1) * 10, activePage * 10)
          )}
        </Accordion>
        <Pagination
          page={activePage}
          onChange={setPage}
          total={Math.ceil(filtered.length / 10)}
          color="red"
          withEdges
        />
      </Box>
    </div>
  );
}
export default Spells;

export async function getServerSideProps() {
  await dbConnect();

  /* Classes */
  const spellCaster = await Class.find({});
  const spellCasterArray = spellCaster
    .map((doc) => {
      const spellcaster = doc.toObject();
      spellcaster._id = spellcaster._id.toString();
      return spellcaster;
    })
    .filter((classObj) => classObj.spellcasting);
  const spellCasters = spellCasterArray.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  /* Spells */
  const spellResults = await Spell.find({});
  const spellArr = spellResults.map((doc) => {
    const spell = doc.toObject();
    spell._id = spell._id.toString();
    return spell;
  });
  const spells = spellArr.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  /* Spells */
  const schoolResults = await MagicSchool.find({});
  const schoolArr = schoolResults.map((doc) => {
    const school = doc.toObject();
    school._id = school._id.toString();
    return school;
  });
  const schools = schoolArr.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return {
    props: { spells: spells, spellCasters: spellCasters, schools: schools },
  };
}
