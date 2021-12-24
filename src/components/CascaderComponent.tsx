import { createElement, useCallback } from "react";
import { useObserver } from "mobx-react";
import { Store } from "../store";

import { Cascader as C } from 'antd';
import { executeAction, getObjectContext, getReferencePart, IAction } from "@jeltemx/mendix-react-widget-utils";
export interface CascaderComponentProps {
    store: Store;
}


export function CascaderComponent(props: CascaderComponentProps) {
    const onChange = useCallback(
        (value: string[], _selectedOptions: any) => {
            props.store.mxOption.options.forEach((v, i) => {
                props.store.mxObject.set(getReferencePart(v.relationNodeSelect, 'referenceAttr'), value[i] ? value[i] : undefined);
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
    return useObserver(() => (
        <C options={props.store.options} loadData={props.store.loadWrapper} onChange={onChange} changeOnSelect />
    ));
}
