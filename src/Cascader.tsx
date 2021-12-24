import { createElement, useEffect, useState } from "react";


import { CascaderContainerProps } from "../typings/CascaderProps";

import "./ui/Cascader.scss";

import { useObserver } from "mobx-react";
import { Store } from "./store";
import { CascaderComponent } from "./components/CascaderComponent";
import { Skeleton } from "antd";


export default function Cascader(props: CascaderContainerProps) {
    const [store, setStore] = useState<Store>();
    useEffect(() => {
        if (props.mxObject) {
            setStore(new Store(props.mxObject, props.options));
        }
        return () => {
            store?.dispose();
        }
    }, [props.mxObject])

    return useObserver(() => (
        store ? <CascaderComponent store={store} /> : <Skeleton active></Skeleton>
    ));
}

