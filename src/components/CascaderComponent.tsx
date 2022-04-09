import { createElement, useCallback, useEffect, useState } from "react";
import { useObserver } from "mobx-react";
import { Store } from "../store";

import { Cascader as C } from 'antd';
import { executeAction, getObjectContext, getReferencePart, IAction } from "@jeltemx/mendix-react-widget-utils";
import { autorun } from "mobx";
export interface CascaderComponentProps {
    store: Store;
}


export function CascaderComponent(props: CascaderComponentProps) {
    const [value, setValue] = useState(props.store.ctx.defaultValue);
    const onChange = useCallback(
        (value: string[], _selectedOptions: any) => {
            setValue(value);
            props.store.ctx.changeValue(value.join('/'));

            props.store.mxOption.options.forEach((v, i) => {
                props.store.mxObject.set(getReferencePart(v.relationNodeSelect, 'referenceAttr'), value[i] ? props.store.t.get(value[i]) : undefined);
            });

            const action: IAction = {};

            if (props.store.mxOption.eventNodeOnClickAction === "open" && props.store.mxOption.eventNodeOnClickForm) {
                action.page = {
                    pageName: props.store.mxOption.eventNodeOnClickForm,
                    openAs: props.store.mxOption.eventNodeOnClickOpenPageAs
                };
            } else if (props.store.mxOption.eventNodeOnClickAction === "microflow" && props.store.mxOption.eventNodeOnClickMicroflow) {
                action.microflow = props.store.mxOption.eventNodeOnClickMicroflow;
            } else if (props.store.mxOption.eventNodeOnClickAction === "nanoflow" && props.store.mxOption.eventNodeOnClickNanoflow.nanoflow) {
                action.nanoflow = props.store.mxOption.eventNodeOnClickNanoflow;
            }

            if (
                typeof action.microflow !== "undefined" ||
                typeof action.nanoflow !== "undefined" ||
                typeof action.page !== "undefined"
            ) {
                if (value.length === props.store.mxOption.options.length)
                    executeAction(action, true, getObjectContext(props.store.mxOption.mxObject!), props.store.mxOption.mxform);
            }
        },
        [props.store],
    )



    useEffect(() => {
        const disp = autorun(() => {
            setValue(props.store.ctx.defaultValue);
        })

        return () => {
            disp();
        }
    }, [])

    return useObserver(() => (
        <C defaultValue={value} value={value} options={props.store.options} loadData={props.store.loadWrapper} onChange={onChange} changeOnSelect />
    ));
}
