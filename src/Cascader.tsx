import { createElement, useState } from "react";

import { Cascader as C } from 'antd';

import { CascaderContainerProps } from "../typings/CascaderProps";

import "./ui/Cascader.scss";

import { useObserver } from "mobx-react";

const optionLists = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        isLeaf: false,
    },
];

const LazyOptions = () => {
    const [options, setOptions] = useState(optionLists);

    const onChange = (value: any, selectedOptions: any) => {
        console.log(value, selectedOptions);
    };

    const loadData = (selectedOptions: any) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        // load options lazily
        setTimeout(() => {
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: `${targetOption.label} Dynamic 1`,
                    value: 'dynamic1',
                },
                {
                    label: `${targetOption.label} Dynamic 2`,
                    value: 'dynamic2',
                },
            ];
            setOptions([...options]);
        }, 1000);
    };

    return <C options={options} loadData={loadData} onChange={onChange} changeOnSelect />;
};

export default function Cascader(props: CascaderContainerProps) {
    console.log(props);


    return useObserver(() => (
        <LazyOptions />
    ));
}

