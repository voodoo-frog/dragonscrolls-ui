import { useState, useEffect } from 'react';
import useSWR from 'swr';

import { sorter, fetcher } from '../../lib/common';

import {
  Accordion,
  Box,
  Divider,
  Pagination,
  Table,
  Text,
  Title,
} from '@mantine/core';

import { Remarkable } from 'remarkable';
const md = new Remarkable('full', {
  html: true,
  typographer: true,
});

function Backgrounds() {
  const [page, setPage] = useState(1);
  const [backgroundData, setBackgroundData] = useState([]);

  const { data: backgrounds } = useSWR('/api/backgrounds', fetcher);

  useEffect(() => {
    if (backgrounds) {
      const sorted = sorter(backgrounds.data);
      setBackgroundData(sorted);
    }
  }, [backgrounds]);

  return (
    <div style={{ margin: 20 }}>
      <Title order={1} mb={15}>
        Backgrounds
      </Title>
      <Divider />

      <Box>
        <Accordion iconPosition="right" mb={50}>
          {backgroundData.length === 0 ? (
            <Accordion.Item label="No backgrounds to display"></Accordion.Item>
          ) : (
            backgroundData
              .map((bg) => (
                <Accordion.Item key={bg.index} label={bg.name}>
                  <Divider mb={30} />
                  {bg.desc.map((descItem, index) => {
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
                    <strong>Skill Proficiencies:</strong>{' '}
                    {bg.starting_proficiencies.length &&
                    bg.starting_proficiencies.filter((c) => {
                      if (c.type === 'skill') return c.name;
                    }).length
                      ? bg.starting_proficiencies
                          .map((c) => {
                            if (c.type === 'skill') return c.name;
                          })
                          .join(', ')
                      : 'None'}
                  </Text>

                  <Text>
                    <strong>Tool Proficiencies:</strong>{' '}
                    {bg.starting_proficiencies.length &&
                    bg.starting_proficiencies.filter((c) => {
                      if (c.type === 'tool') return c.name;
                    }).length
                      ? bg.starting_proficiencies
                          .map((c) => {
                            if (c.type === 'tool') return c.name;
                          })
                          .join(', ')
                      : 'None'}
                  </Text>

                  <Text>
                    <strong>Languages:</strong>{' '}
                    {bg.language_options.length
                      ? bg.language_options.map((c) => c.name).join(', ')
                      : 'None'}
                  </Text>

                  <Text>
                    <strong>Equipment:</strong> {bg.starting_equipment_desc}
                  </Text>

                  <Title order={3} my={15}>
                    {bg.feature.name}
                  </Title>
                  {bg.feature.desc.map((d, i) => (
                    <Text key={i}>{d}</Text>
                  ))}

                  <Title order={3} my={15}>
                    Suggested Characteristics
                  </Title>
                  <Text>{bg.suggested_characteristics}</Text>

                  <Title order={4} my={10}>
                    Personality Traits
                  </Title>
                  <Table>
                    <thead>
                      <tr>
                        <th>d{bg.personality_traits.from.length}</th>
                        <th>Personality trait</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bg.personality_traits.from.map((trait, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{trait}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Title order={4} my={10}>
                    Ideals
                  </Title>
                  <Table>
                    <thead>
                      <tr>
                        <th>d{bg.ideals.from.length}</th>
                        <th>Ideal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bg.ideals.from.map((ideal, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            {ideal.desc} ({ideal.alignments_desc})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Title order={4} my={10}>
                    Bonds
                  </Title>
                  <Table>
                    <thead>
                      <tr>
                        <th>d{bg.bonds.from.length}</th>
                        <th>Bond</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bg.bonds.from.map((bond, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{bond}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Title order={4} my={10}>
                    Flaws
                  </Title>
                  <Table>
                    <thead>
                      <tr>
                        <th>d{bg.flaws.from.length}</th>
                        <th>Flaw</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bg.flaws.from.map((flaw, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{flaw}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Item>
              ))
              .slice((page - 1) * 10, page * 10)
          )}
        </Accordion>
        <Pagination
          position="center"
          value={page}
          page={page}
          onChange={(value) => setPage(value)}
          total={Math.ceil(backgroundData.length / 10)}
          color="red"
          withEdges
        />
      </Box>
    </div>
  );
}
export default Backgrounds;
