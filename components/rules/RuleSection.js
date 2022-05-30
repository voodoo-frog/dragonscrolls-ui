import { Divider, Spoiler } from '@mantine/core';

import { Remarkable } from 'remarkable';
const md = new Remarkable('full', {
  html: true,
  typographer: true,
});

function RuleSection({ rule, subsections }) {
  return (
    <div sx={{ width: '70%' }}>
      <div
        key={rule.index}
        dangerouslySetInnerHTML={{
          __html: md.render(rule.desc),
        }}
      />

      {subsections.map((subsection) => (
        <>
          <Divider />
          <Spoiler
            maxHeight={160}
            showLabel="Show more"
            hideLabel="Hide"
            styles={{
              control: { color: 'red' },
            }}
          >
            <div
              key={subsection.index}
              dangerouslySetInnerHTML={{
                __html: md.render(subsection.desc),
              }}
            />
          </Spoiler>
        </>
      ))}
    </div>
  );
}
export default RuleSection;
