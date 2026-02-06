import React, { useState } from "react";

type Row = {
  id: number;
  label: string;
  value: number;
  children?: Row[];
};

const initialData: Row[] = [
  
    {
      "id": 1,
      "label": "Electronics",
      "value": 1400, //this value needs to be calculated from the children values (800+700)
      "children": [
        {
          "id": 1,
          "label": "Phones",
          "value": 800
        },
        {
          "id": 2,
          "label": "Laptops",
          "value": 700
        }
      ]
    },
    {
      "id": 3,
      "label": "Furniture",
      "value": 1000, //this need to be calculated from the children values (300+700)
      "children": [
        {
          "id": 3,
          "label": "Tables",
          "value": 300
        },
        {
          "id": 4,
          "label": "Chairs",
          "value": 700
        }
      ]
}
];

const HierarchicalTable = () => {
  const [rows, setRows] = useState<Row[]>(initialData);

  const getTotal = (row: Row): number => {
    if (!row.children) return row.value;

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
            {row.children ? "children" : "leaf"} {row.label}
          </td>
          <td>
            {row.children ? (
              <b>{getTotal(row)}</b>
            ) : (
              <input
                type="number"
                value={row.value}
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
