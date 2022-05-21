import { useState, useEffect } from 'react';

import Class from '../../models/class';
import Spell from '../../models/spell';
import MagicSchool from '../../models/magic_school';

import styles from '../../styles/Spells.module.css';

import dbConnect from '../../lib/dbConnect';
import { sorter } from '../../lib/common';

import Image from 'next/image';

import {
  Accordion,
  Avatar,
  Button,
  Box,
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
} from '@mantine/core';

import { Remarkable } from 'remarkable';
const md = new Remarkable('full', {
  html: true,
  typographer: true,
});

function Spells({ spells, spellCasters, schools }) {
  const [search, setSearch] = useState({
    name: '',
    level: null,
    school: [],
    castingTime: [],
    activePage: 1,
  });

  const [classFilter, setClassFilter] = useState([]);
  const [filtered, setFiltered] = useState([...spells]);

  const { name, level, school, castingTime, activePage } = search;

  const handleFilterByClass = (className) => {
    if (classFilter.includes(className)) {
      setClassFilter(classFilter.filter((c) => c !== className));
    } else {
      setClassFilter([...classFilter, className]);
    }
  };

  const handleFilterReset = () => {
    setSearch({
      class: '',
      name: '',
      level: null,
      school: [],
      castingTime: [],
      activePage: 1,
    });
    setClassFilter([]);
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
    let spellList = spells;
    const handleFilterByCategory = (list) => {
      if (list.length > 0) {
        let filters = list;
        if (name.length) {
          filters = filters.filter((spell) =>
            spell.name.toLowerCase().includes(name.toLowerCase())
          );
        }
        if (level) {
          filters = filters.filter((spell) => spell.level === level);
        }
        if (school.length) {
          filters = filters.filter((spell) =>
            school.includes(spell.school.name)
          );
        }
        if (castingTime.length) {
          const lowerCaseCastingTimes = castingTime.map((time) =>
            time.toLowerCase()
          );
          filters = filters.filter((spell) =>
            lowerCaseCastingTimes.includes(spell.casting_time.toLowerCase())
          );
        }
        return setFiltered(filters);
      }
    };

    if (classFilter.length) {
      spellList = spellList.filter((spell) => {
        const classes = spell.classes.map((c) => c.name);
        return classFilter.some((c) => classes.includes(c));
      });
    }

    return handleFilterByCategory(spellList);
  }, [castingTime, classFilter, level, name, school, search, spells]);

  return (
    <div style={{ margin: 20 }}>
      <Title order={1} mb={15}>
        All Spells
      </Title>
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
              onChange={(e) => setSearch({ ...search, name: e.target.value })}
            />
            <NumberInput
              hideControls
              value={level}
              label="Spell Level"
              placeholder="Select spell levels..."
              min={0}
              max={9}
              radius="xl"
              onChange={(value) => setSearch({ ...search, level: value })}
            />
            <MultiSelect
              clearable
              searchable
              value={school}
              label="Spell School"
              placeholder="Select spell schools..."
              nothingFound="Nothing found"
              radius="xl"
              onChange={(value) => setSearch({ ...search, school: value })}
              data={schools.map((school) => school.name)}
            />
            <MultiSelect
              clearable
              searchable
              value={castingTime}
              label="Casting Time"
              placeholder="Select casting times..."
              nothingFound="Nothing found"
              radius="xl"
              onChange={(value) => setSearch({ ...search, castingTime: value })}
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
            />
            <Button
              type="submit"
              color="red"
              size="md"
              my="auto"
              sx={{ alignSelf: 'center' }}
              onClick={handleFilterReset}
            >
              Reset Filters
            </Button>
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
                  key={spell.index}
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
              .slice((activePage - 1) * 10, activePage * 10)
          )}
        </Accordion>
        <Pagination
          value={activePage}
          page={activePage}
          onChange={(value) => setSearch({ ...search, activePage: value })}
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
  const spellCasters = sorter(spellCasterArray);

  /* Spells */
  const spellResults = await Spell.find({});
  const spellArr = spellResults.map((doc) => {
    const spell = doc.toObject();
    spell._id = spell._id.toString();
    return spell;
  });
  const spells = sorter(spellArr);

  /* Schools */
  const schoolResults = await MagicSchool.find({});
  const schoolArr = schoolResults.map((doc) => {
    const school = doc.toObject();
    school._id = school._id.toString();
    return school;
  });
  const schools = sorter(schoolArr);

  return {
    props: { spells: spells, spellCasters: spellCasters, schools: schools },
  };
}
