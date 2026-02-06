import React, { useState } from "react";

type Row = {
  id: number;
  name: string;
  amount: number;
  children?: Row[];
};

const initialData: Row[] = [
  {
    id: 1,
    name: "Infrastructure",
    amount: 0,
    children: [
      { id: 2, name: "Server", amount: 500 },
      { id: 3, name: "Network", amount: 300 }
    ]
  }
];

const HierarchicalTable = () => {
  const [rows, setRows] = useState<Row[]>(initialData);

  const getTotal = (row: Row): number => {
    if (!row.children) return row.amount;

    return row.children.reduce(
      (sum, child) => sum + getTotal(child),
      0
    );
  };

  const updateAmount = (
    data: Row[],
    id: number,
    value: number
  ): Row[] => {
    return data.map((row) => {
      if (row.id === id) {
        return { ...row, amount: value };
      }

      if (row.children) {
        return {
          ...row,
          children: updateAmount(row.children, id, value)
        };
      }

      return row;
    });
  };

  const handleChange = (id: number, value: number) => {
    setRows(updateAmount(rows, id, value));
  };

  const renderRows = (data: Row[], level = 0) =>
    data.map((row) => (
      <React.Fragment key={row.id}>
        <tr>
          <td style={{ paddingLeft: level * 20 }}>
            {row.children ? "children" : "leaf"} {row.name}
          </td>
          <td>
            {row.children ? (
              <b>{getTotal(row)}</b>
            ) : (
              <input
                type="number"
                value={row.amount}
                onChange={(e) =>
                  handleChange(row.id, Number(e.target.value))
                }
              />
            )}
          </td>
        </tr>

        {row.children && renderRows(row.children, level + 1)}
      </React.Fragment>
    ));

  return (
    <table border={1} cellPadding={8}>
      <thead>
        <tr>
          <th> Label</th>
          <th>value</th>
          <th>Input</th>
          <th>Allocation %</th>
          <th>Allocation Val</th>
          <th>Variance %</th>
        </tr>
      </thead>
      <tbody>{renderRows(rows)}</tbody>
    </table>
  );
};

export default HierarchicalTable;
