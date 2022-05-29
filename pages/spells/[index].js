import { useState, useEffect } from 'react';

import { sorter, capitalize } from '../../lib/common';

import styles from '../../styles/Spells.module.css';

import Spell from '../../models/spell';
import MagicSchool from '../../models/magic_school';

import dbConnect from '../../lib/dbConnect';

import Image from 'next/image';

import {
  Accordion,
  Avatar,
  Box,
  Button,
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

function ClassSpells({ spells, schools, className, classIndex }) {
  const [filtered, setFiltered] = useState([...spells]);
  const [search, setSearch] = useState({
    name: '',
    level: null,
    school: [],
    castingTime: [],
    page: 1,
  });
  const { name, level, school, castingTime, page } = search;

  const handleFilterReset = () => {
    setSearch({
      name: '',
      level: null,
      school: [],
      castingTime: [],
      page: 1,
    });
    setFiltered(spells);
  };

  useEffect(() => {
    let spellList = spells;
    if (spellList.length > 0) {
      if (name.length) {
        spellList = spellList.filter((spell) =>
          spell.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      if (level || level === 0) {
        spellList = spellList.filter((spell) => spell.level === level);
      }
      if (school.length) {
        spellList = spellList.filter((spell) =>
          school.includes(spell.school.name)
        );
      }
      if (castingTime.length) {
        const lowerCaseCastingTimes = castingTime.map((time) =>
          time.toLowerCase()
        );
        spellList = spellList.filter((spell) =>
          lowerCaseCastingTimes.includes(spell.casting_time.toLowerCase())
        );
      }
    }
    setSearch((s) => ({ ...s, page: 1 }));
    return setFiltered(spellList);
  }, [castingTime, level, name, school, spells]);

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

  return (
    <div style={{ margin: 20 }}>
      <Group mb={20}>
        <Image
          src={`/images/${classIndex}-emblem-color.jpeg`}
          width={100}
          height={100}
          alt={className}
          style={{
            borderRadius: '50%',
            margin: '0 auto',
            display: 'block',
            paddingBottom: 20,
          }}
        />
        <Title order={1} ml={-40} style={{ zIndex: 1000 }}>
          {className} Spells
        </Title>
      </Group>
      <Divider mb={30} />

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
        {filtered.length > 0 ? (
          <>
            <Accordion iconPosition="right" mb={50}>
              {filtered
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
                .slice((page - 1) * 10, page * 10)}
            </Accordion>
            <Pagination
              position="center"
              value={page}
              page={page}
              onChange={(value) => setSearch({ ...search, page: value })}
              total={Math.ceil(filtered.length / 10)}
              color="red"
              withEdges
            />
          </>
        ) : (
          <Text size="xl">No spells found</Text>
        )}
      </Box>
    </div>
  );
}
export default ClassSpells;

export async function getServerSideProps({ params }) {
  await dbConnect();
  const className = capitalize(params.index);

  /* Spells */
  const spellResults = await Spell.find({});
  const spellArr = spellResults
    .map((doc) => {
      const spell = doc.toObject();
      spell._id = spell._id.toString();
      return spell;
    })
    .filter((spell) => spell.classes.some((c) => c.name === className));
  const spells = sorter(spellArr);

  /* Schools */
  const schoolResults = await MagicSchool.find({});
  const schoolArr = schoolResults.map((doc) => {
    const school = doc.toObject();
    school._id = school._id.toString();
    return school;
  });
  const schools = sorter(schoolArr);

  return { props: { spells, schools, className, classIndex: params.index } };
}
