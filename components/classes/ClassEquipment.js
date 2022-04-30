import { List, Title, Text } from '@mantine/core';

function ClassEquipment({ starting_equipment, starting_equipment_options }) {
  const equipment = starting_equipment.map(
    ({ quantity, equipment_option, equipment }) => {
      if (equipment_option) {
        const { choose } = equipment_option;
        const item =
          choose === 1
            ? `any ${equipment_option.equipment.name}`
            : `any ${choose} ${equipment_option.equipment.name}s`;
        return item;
      }
      return quantity === 1
        ? `${quantity} ${equipment.name}`
        : `${quantity} ${equipment.name}s`;
    }
  );
  return (
    <>
      <Title order={4}>Equipment</Title>{' '}
      <Text>
        You start with the following equipment, in addition to the equipment
        granted by your background:
      </Text>
      <List withPadding>
        {starting_equipment_options.map((option) => {
          const items = option.from.map((opt) => {
            if (opt instanceof Array) {
              const optBank = opt.map((item) => {
                const { quantity, equipment, equipment_option } = item;
                if (equipment_option) {
                  const { choose } = equipment_option;
                  return choose === 1
                    ? `any ${equipment_option.equipment.name}`
                    : `any ${choose} ${equipment_option.equipment.name}s`;
                }
                return quantity === 1
                  ? equipment.name
                  : `${quantity} ${equipment.name}s`;
              });
              return (
                optBank.slice(0, -1).join(', ') + ' and ' + optBank.slice(-1)
              );
            }
            const { quantity, equipment, equipment_option } = opt;
            if (equipment_option) {
              const { choose } = equipment_option;
              return choose === 1
                ? `any ${equipment_option.equipment.name}`
                : `any ${choose} ${equipment_option.equipment.name}s`;
            }
            let item =
              quantity === 1 && equipment
                ? `${quantity} ${equipment.name}`
                : `${quantity} ${equipment.name}s`;
            if (opt.prerequisites) item = `${item} (if proficient)`;
            return item;
          });
          return (
            <List.Item key={items.join(', ')}>
              {items.length === 2
                ? `(a) ${items[0]} or (b) ${items[1]}`
                : `(a) ${items[0]} (b) ${items[1]} or (c) ${items[2]}`}
            </List.Item>
          );
        })}

        <List.Item>
          {equipment.length > 1
            ? equipment.slice(0, -1).join(', ') + ' and ' + equipment.slice(-1)
            : equipment[0]}
        </List.Item>
      </List>
    </>
  );
}
export default ClassEquipment;
