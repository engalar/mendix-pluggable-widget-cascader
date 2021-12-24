import { createElement } from "react";
import { useObserver } from "mobx-react";
import { Store } from "../store";

import { Cascader as C } from 'antd';
export interface CascaderComponentProps {
    store: Store;
}


const onChange = (value: any, selectedOptions: any) => {
    console.log(value, selectedOptions);
};

export function CascaderComponent(props: CascaderComponentProps) {
    return useObserver(() => (
        <C options={props.store.options} loadData={props.store.loadWrapper} onChange={onChange} changeOnSelect />
    ));
}
