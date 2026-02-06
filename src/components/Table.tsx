import React, { use, useEffect } from 'react'
import { Data } from './types/data';
import { Button } from '@mui/material';

const Table = () => {
    const [value, setValue] = React.useState<number>(0);
    const rowData: Data[] = [
        {
            "id": "electronics",
            "label": "Electronics",
            "value": 1500, //this value needs to be calculated from the children values (800+700)
            "children": [
                {
                    "id": "phones",
                    "label": "Phones",
                    "value": 800
                },
                {
                    "id": "laptops",
                    "label": "Laptops",
                    "value": 700
                }
            ]
        },
        {
            "id": "furniture",
            "label": "Furniture",
            "value": 1000, //this need to be calculated from the children values (300+700)
            "children": [
                {
                    "id": "tables",
                    "label": "Tables",
                    "value": 300
                },
                {
                    "id": "chairs",
                    "label": "Chairs",
                    "value": 700
                }
            ]
        }
    ]

    const [rowsData, setRowsData] = React.useState<Data[]>(rowData);
    const calculateTotalValue = (data: Data): number => {
        if (!data.children || data.children.length === 0) {

            return data.value;
        } else if (data.children && data.children.length > 0) {
            const childTotal = data.children.reduce((sum, child) => sum + calculateTotalValue(child), 0);
            return childTotal;
        }
        return 0
    }

    const updatedData = (data: Data[]): Data[] => {
        return data.map((row) => {
            if (row.children && row.children.length > 0) {
                const updatedChildren = updatedData(row.children);
                const childTotal = updatedChildren.reduce((sum, child) => sum + child.value, 0);
                return {
                    ...row,
                    value: childTotal,
                    children: updatedChildren
                };
            }
            return row;
        });
    };

    const handlechange = (data: Data) => {
        console.log(data)
        setRowsData((prevData) => {
            const updatedData = prevData.map((row) => {
                if (row.id === data.id) {
                    return { ...row, value: data.value };
                } else if (row.children && row.children.length > 0) {
                    const updatedChildren = row.children.map((child) => {
                        if (child.id === data.id) {
                            return { ...child, value: data.value };
                        }
                        return child;
                    });
                    const childTotal = updatedChildren.reduce((sum, child) => sum + child.value, 0);
                    return { ...row, value: childTotal, children: updatedChildren };
                }
                return row;
            });
            return updatedData;
        });
    }
   
    return (
        <div>
            <h2>Hierarchical Table Website</h2>
            <table>
                <thead>
                 <tr>
                       <th> Label</th>
                    <th>value</th>
                    <th>Label</th>
                    <th>Allocation %</th>
                    <th>Allocation Val</th>
                    <th>Variance %</th>
                 </tr>
                </thead>
                <tbody>
                    {updatedData(rowsData).map((row) => (
                        <td key={row.id}>
                            <td>{row.label}</td>
                            <td>{row.value}</td>
                            {row.children && row.children.length > 0 ? (
                                row.children.map((child) => (
                                    <React.Fragment key={child.id}>
                                        <tr>
                                        <td>{child.label}</td>
                                        <td>{((child.value / row.value) * 100).toFixed(2)}%</td>
                                        <td>{child.value}</td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : null}
                        </td>
                    ))}
                    <input type="text" placeholder='Enter label' onChange={ (e) => setValue(Number(e.target.value))} />
                    <Button >Allocation Val</Button>
                    <Button >Allocation %</Button>
                </tbody>
            </table>
        </div>
    )
}
export default Table