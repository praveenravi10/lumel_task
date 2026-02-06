import React, { useState } from "react";

type Row = {
  id: number;
  label: string;
  value: number;
  children?: Row[];
};

const initialData: Row[] = [
  {
    id: 1,
    label: "Electronics",
    value: 0,
    children: [
      { id: 11, label: "Phones", value: 800 },
      { id: 12, label: "Laptops", value: 700 }
    ]
  },
  {
    id: 2,
    label: "Furniture",
    value: 0,
    children: [
      { id: 21, label: "Tables", value: 300 },
      { id: 22, label: "Chairs", value: 700 }
    ]
  }
];

const HierarchicalTable = () => {
  const [rows, setRows] = useState<Row[]>(initialData);
  const getTotal = (row: Row): number => {
    if (!row.children) return row.value;
    return row.children.reduce((sum, child) => sum + getTotal(child), 0);
  };
  const grandTotal = rows.reduce(
    (sum, row) => sum + getTotal(row),
    0
  );
  const updateValue = (
    data: Row[],
    id: number,
    value: number
  ): Row[] =>
    data.map((row) => {
      if (row.id === id && !row.children) {
        return { ...row, value };
      }

      if (row.children) {
        return {
          ...row,
          children: updateValue(row.children, id, value)
        };
      }

      return row;
    });

  const handleChange = (id: number, value: number) => {
    setRows(updateValue(rows, id, value));
  };

  const renderRows = (data: Row[], level = 0) =>
    data.map((row) => {
      const total = getTotal(row);
      const allocationPercent =
        grandTotal === 0 ? 0 : (total / grandTotal) * 100;

      return (
        <React.Fragment key={row.id}>
          <tr>
            <td style={{ paddingLeft: level * 20 }}>
              {row.label}
            </td>

            <td>{row.children ? total : row.value}</td>

            <td>
              {!row.children && (
                <input
                  type="number"
                  value={row.value}
                  onChange={(e) =>
                    handleChange(row.id, Number(e.target.value))
                  }
                />
              )}
            </td>

            <td>{allocationPercent.toFixed(2)}%</td>

            <td>{total.toFixed(2)}</td>

            <td>
              {row.children
                ? "—"
                : ((row.value / total) * 100 || 0).toFixed(2) + "%"}
            </td>
          </tr>

          {row.children && renderRows(row.children, level + 1)}
        </React.Fragment>
      );
    });

  return (
    <table border={1} cellPadding={8}>
      <thead>
        <tr>
          <th>Label</th>
          <th>Total</th>
          <th>Input</th>
          <th>Allocation %</th>
          <th>Allocation Value</th>
          <th>Variance %</th>
        </tr>
      </thead>
      <tbody>{renderRows(rows)}</tbody>
    </table>
  );
};

export default HierarchicalTable;
