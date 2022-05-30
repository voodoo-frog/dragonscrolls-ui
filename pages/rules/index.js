import { Title, Tabs } from '@mantine/core';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

import styles from '../../styles/Rules.module.css';

import RuleSection from '../../components/rules/RuleSection';

import { fetcher } from '../../lib/common';

function Rules() {
  const { data: rules } = useSWR('/api/rules', fetcher);
  const { data: rule_sections } = useSWR('/api/rule_sections', fetcher);

  const [rulesData, setRulesData] = useState([]);
  const [ruleSectionsData, setRuleSectionsData] = useState([]);

  useEffect(() => {
    if (rules) setRulesData(rules.data);

    if (rule_sections) setRuleSectionsData(rule_sections.data);
  }, [rules, rule_sections]);

  return (
    <div>
      <Title order={1}>Basic Rules</Title>
      {rulesData.length > 0 ? (
        <Tabs
          color="red"
          variant="outline"
          tabPadding="xl"
          orientation="vertical"
          classNames={{
            tabInner: styles.tabInner,
          }}
        >
          {rulesData.map((rule) => {
            const subsections = ruleSectionsData.filter((ruleSection) =>
              rule.subsections.some(
                (subsection) => subsection.index === ruleSection.index
              )
            );
            return (
              <Tabs.Tab
                key={rule.index}
                label={rule.name}
                color="red"
                tabPadding="xl"
                orientation="vertical"
              >
                {' '}
                <RuleSection
                  key={rule.index}
                  rule={rule}
                  subsections={subsections}
                />
              </Tabs.Tab>
            );
          })}
        </Tabs>
      ) : null}
    </div>
  );
}
export default Rules;
