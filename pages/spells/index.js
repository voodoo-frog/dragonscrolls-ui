import { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

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
  Divider,
  Grid,
  Group,
  NumberInput,
  Pagination,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

import { Remarkable } from 'remarkable';
const md = new Remarkable('full', {
  html: true,
  typographer: true,
});

const StyledTextField = styled(TextField)({
  'label + &': {
    marginTop: 25,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 30,
    },
  },
});

const StyledSelect = styled(Select)({
  borderRadius: 30,
  'label + &': {
    marginTop: 25,
  },
});

function Spells({ spells, spellCasters, schools }) {
  const [search, setSearch] = useState({
    name: '',
    levels: [],
    school: [],
    castingTime: [],
    page: 1,
  });

  const [classFilter, setClassFilter] = useState([]);
  const [filtered, setFiltered] = useState([...spells]);
  const [debounced] = useDebouncedValue(search, 500);

  const { name, levels, school, castingTime, page } = search;

  const handleLevels = (e) => {
    const { value } = e.target;
    setSearch({
      ...search,
      levels: value instanceof String ? value.split(',') : value,
    });
  };

  const handleSchools = (e) => {
    const { value } = e.target;
    setSearch({
      ...search,
      school: value instanceof String ? value.split(',') : value,
    });
  };

  const handleCastingTimes = (e) => {
    const { value } = e.target;
    setSearch({
      ...search,
      castingTime: value instanceof String ? value.split(',') : value,
    });
  };

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
      page: 1,
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
        if (debounced.name.length) {
          filters = filters.filter((spell) =>
            spell.name.toLowerCase().includes(name.toLowerCase())
          );
        }
        if (debounced.levels.length) {
          filters = filters.filter((spell) => levels.includes(spell.level));
        }
        if (debounced.school.length) {
          filters = filters.filter((spell) =>
            school.includes(spell.school.name)
          );
        }
        if (debounced.castingTime.length) {
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
    setSearch((s) => ({ ...s, page: 1 }));
    return handleFilterByCategory(spellList);
  }, [castingTime, classFilter, levels, name, school, spells, debounced]);

  const casting_times = [
    '1 Action',
    '1 Bonus Action',
    '1 Reaction',
    '1 Minute',
    '10 Minutes',
    '1 Hour',
    '8 Hours',
    '12 Hours',
    '24 Hours',
  ];

  const spell_levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
          <Group className={styles.formGroup}>
            <FormControl variant="standard" className={styles.formControlText}>
              <InputLabel shrink className={styles.inputLabel}>
                Spell Name
              </InputLabel>
              <StyledTextField
                id="name"
                placeholder="Search Spell names..."
                size="small"
                value={name}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </FormControl>

            <FormControl
              variant="standard"
              className={styles.formControlSelect}
              size="small"
            >
              <InputLabel
                shrink
                htmlFor="levels-label"
                className={styles.inputLabel}
              >
                Spell Level
              </InputLabel>
              <StyledSelect
                labelId="levels-label"
                id="levels"
                multiple
                value={levels}
                onChange={handleLevels}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.sort().join(', ')}
              >
                {spell_levels.map((lvl) => (
                  <MenuItem key={lvl} value={lvl}>
                    <Checkbox checked={levels.indexOf(lvl) > -1} />
                    <ListItemText primary={lvl === 0 ? 'Cantrip' : lvl} />
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            <FormControl
              variant="standard"
              className={styles.formControlSelect}
              size="small"
            >
              <InputLabel
                shrink
                htmlFor="school-label"
                className={styles.inputLabel}
              >
                Magic School
              </InputLabel>
              <StyledSelect
                labelId="school-label"
                id="school"
                multiple
                value={school}
                onChange={handleSchools}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(', ')}
              >
                {schools.map((s) => (
                  <MenuItem key={s.name} value={s.name}>
                    <Checkbox checked={school.indexOf(s.name) > -1} />
                    <ListItemText primary={s.name} />
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            <FormControl
              variant="standard"
              className={styles.formControlSelect}
              size="small"
            >
              <InputLabel
                shrink
                htmlFor="casting-time-label"
                className={styles.inputLabel}
              >
                Casting Time
              </InputLabel>
              <StyledSelect
                labelId="casting-time-label"
                id="casting-time"
                multiple
                value={castingTime}
                onChange={handleCastingTimes}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(', ')}
              >
                {casting_times.map((ct) => (
                  <MenuItem key={ct} value={ct}>
                    <Checkbox checked={castingTime.indexOf(ct) > -1} />
                    <ListItemText primary={ct} />
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            <Button
              type="submit"
              color="red"
              size="md"
              onClick={handleFilterReset}
            >
              Reset Filters
            </Button>
          </Group>
        </div>
      </Box>

      <Divider my={30} />

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
export default Spells;

export async function getServerSideProps() {
  await dbConnect();

  /* Classes */
  const classResults = await Class.find({});
  const classArr = classResults
    .map((doc) => {
      const classResults = doc.toObject();
      classResults._id = classResults._id.toString();
      return classResults;
    })
    .filter((classObj) => classObj.spellcasting);
  const spellCasters = sorter(classArr);

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
