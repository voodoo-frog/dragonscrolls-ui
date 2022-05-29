import { useState, useEffect } from 'react';
import useSWR from 'swr';

import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import styles from '../../styles/Equipment.module.css';

import { sorter, fetcher, goldConverter } from '../../lib/common';

import {
  Accordion,
  Button,
  Box,
  Divider,
  Grid,
  Group,
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

function Equipment() {
  const { data: equipment } = useSWR('/api/equipment', fetcher);
  const [equipmentData, setEquipmentData] = useState([]);
  const [search, setSearch] = useState({
    name: '',
    cost_min: null,
    cost_max: null,
    weight_min: null,
    weight_max: null,
    category: [],
    page: 1,
  });
  const [debounced] = useDebouncedValue(search, 500);
  const [filtered, setFiltered] = useState([...equipmentData]);

  const { name, cost_min, cost_max, weight_min, weight_max, category, page } =
    search;

  const handleCategories = (e) => {
    const { value } = e.target;
    setSearch({
      ...search,
      category: value instanceof String ? value.split(',') : value,
    });
  };

  const handleFilterReset = () => {
    setSearch({
      name: '',
      cost_min: '',
      cost_max: '',
      weight_min: '',
      weight_max: '',
      category: [],
      page: 1,
    });
    setFiltered(equipmentData);
  };

  function AccordionLabel({
    name,
    equipment_category,
    cost,
    weight,
    armor_category,
    gear_category,
    tool_category,
    vehicle_category,
    weapon_category,
  }) {
    let category_name;
    switch (equipment_category.index) {
      case 'armor':
        category_name = `${armor_category} Armor`;
        break;
      case 'adventuring-gear':
        category_name = gear_category.name;
        break;
      case 'tools':
        category_name = tool_category;
        break;
      case 'mounts-and-vehicles':
        category_name = vehicle_category;
        break;
      case 'weapon':
        category_name = `${weapon_category} Weapon`;
        break;

      default:
        break;
    }
    return (
      <Group noWrap>
        <Group sx={{ width: 300 }}>
          <div>
            <Text>{name}</Text>
            <Text size="sm" color="dimmed" weight={400}>
              {equipment_category.name}
            </Text>
          </div>
        </Group>
        <Text sx={{ width: 150 }}>
          {cost.quantity > 0 ? `${cost.quantity} ${cost.unit}` : '--'}
        </Text>
        <Text sx={{ width: 150 }}>
          {weight > 0 ? `${weight} ${weight === 1 ? 'lb' : 'lbs'}` : '--'}
        </Text>
        <Text sx={{ width: 250 }}>{category_name}</Text>
      </Group>
    );
  }

  useEffect(() => {
    if (equipment) {
      const sorted = sorter(equipment.data);
      setEquipmentData(sorted);
    }
  }, [equipment]);

  useEffect(() => {
    let equipmentList = equipmentData;
    if (equipmentList.length > 0) {
      if (debounced.name.length) {
        equipmentList = equipmentList.filter((item) =>
          item.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      if (debounced.cost_min) {
        equipmentList = equipmentList.filter((item) => {
          const { quantity, unit } = item.cost;
          const value = goldConverter(quantity, unit);
          return value >= cost_min;
        });
      }
      if (debounced.cost_max) {
        equipmentList = equipmentList.filter((item) => {
          const { quantity, unit } = item.cost;
          const value = goldConverter(quantity, unit);
          return value <= cost_max;
        });
      }
      if (debounced.weight_min) {
        equipmentList = equipmentList.filter(
          (item) => item.weight >= weight_min
        );
      }
      if (debounced.weight_max) {
        equipmentList = equipmentList.filter(
          (item) => item.weight <= weight_max
        );
      }
      if (debounced.category.length) {
        const lowerCaseCategories = category.map((c) => c.toLowerCase());
        equipmentList = equipmentList.filter((item) =>
          lowerCaseCategories.includes(
            item.equipment_category.name.toLowerCase()
          )
        );
      }
    }
    setSearch((s) => ({ ...s, page: 1 }));
    return setFiltered(equipmentList);
  }, [
    equipmentData,
    debounced,
    name,
    cost_min,
    cost_max,
    weight_min,
    weight_max,
    category,
  ]);

  const categories = [
    'Adventuring Gear',
    'Armor',
    'Mounts and Vehicles',
    'Tools',
    'Weapon',
  ];

  return (
    <div style={{ margin: 20 }}>
      <Title order={1} mb={15}>
        Equipment
      </Title>
      <Divider mb={30} />

      <Box mx="auto">
        <div className={styles.form}>
          <Group className={styles.formGroup}>
            <FormControl variant="standard" className={styles.formControlText}>
              <InputLabel shrink className={styles.inputLabel}>
                Equipment Name
              </InputLabel>
              <StyledTextField
                id="name"
                placeholder="Search equipment name..."
                size="small"
                value={name}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </FormControl>

            <FormControl
              variant="standard"
              className={styles.formControlNumber}
            >
              <InputLabel
                shrink
                htmlFor="min-cost"
                className={styles.inputLabel}
              >
                Cost (gp)
              </InputLabel>
              <StyledTextField
                id="min-cost"
                type="number"
                placeholder="Min"
                size="small"
                value={cost_min}
                onChange={(e) =>
                  setSearch({ ...search, cost_min: e.target.value })
                }
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </FormControl>
            <FormControl
              variant="standard"
              className={styles.formControlNumber}
            >
              <InputLabel shrink className={styles.inputLabel} />
              <StyledTextField
                id="max-cost"
                type="number"
                placeholder="Max"
                size="small"
                value={cost_max}
                onChange={(e) =>
                  setSearch({ ...search, cost_max: e.target.value })
                }
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </FormControl>

            <FormControl
              variant="standard"
              className={styles.formControlNumber}
            >
              <InputLabel
                shrink
                htmlFor="min-weight"
                className={styles.inputLabel}
              >
                Weight (lbs)
              </InputLabel>
              <StyledTextField
                id="min-weight"
                type="number"
                placeholder="Min"
                size="small"
                value={weight_min}
                onChange={(e) =>
                  setSearch({ ...search, weight_min: e.target.value })
                }
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </FormControl>
            <FormControl
              variant="standard"
              className={styles.formControlNumber}
            >
              <InputLabel shrink className={styles.inputLabel} />
              <StyledTextField
                id="max-weight"
                type="number"
                placeholder="Max"
                size="small"
                value={weight_max}
                onChange={(e) =>
                  setSearch({ ...search, weight_max: e.target.value })
                }
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </FormControl>

            <FormControl
              variant="standard"
              className={styles.formControlSelect}
              size="small"
            >
              <InputLabel
                shrink
                htmlFor="category-label"
                className={styles.inputLabel}
              >
                Category
              </InputLabel>
              <StyledSelect
                labelId="category-label"
                id="category"
                multiple
                value={category}
                onChange={handleCategories}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(', ')}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    <Checkbox checked={category.indexOf(c) > -1} />
                    <ListItemText primary={c} />
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
              Reset filters
            </Button>
          </Group>
        </div>
      </Box>

      <Divider my={30} />

      <Group mt={20}>
        <Title order={4} sx={{ paddingLeft: 10, width: 300 }}>
          Name
        </Title>
        <Title order={4} sx={{ paddingLeft: 10, width: 150 }}>
          Cost
        </Title>
        <Title order={4} sx={{ paddingLeft: 10, width: 150 }}>
          Weight
        </Title>
        <Title order={4} sx={{ paddingLeft: 10, width: 250 }}>
          Category
        </Title>
      </Group>

      <Box>
        {filtered.length > 0 ? (
          <>
            <Accordion iconPosition="right" mb={50}>
              {filtered
                .map((item) => (
                  <Accordion.Item
                    key={item.index}
                    label={<AccordionLabel {...item} />}
                  >
                    {item.desc.map((descItem, index) => {
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
          <Text size="xl">No equipment found</Text>
        )}
      </Box>
    </div>
  );
}
export default Equipment;
