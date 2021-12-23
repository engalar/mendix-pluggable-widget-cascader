import { createElement, useState } from "react";


import { CascaderContainerProps } from "../typings/CascaderProps";

import "./ui/Cascader.scss";

import { useObserver } from "mobx-react";
import { Store } from "./store";
import { CascaderComponent } from "./components/CascaderComponent";


export default function Cascader(props: CascaderContainerProps) {
    console.log(props);

    const [store] = useState(new Store());

    return useObserver(() => (
        <CascaderComponent store={store} />
    ));
}

