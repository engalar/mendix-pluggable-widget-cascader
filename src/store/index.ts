import { fetchByXpath, getReferencePart } from "@jeltemx/mendix-react-widget-utils";
import { CascaderOptionType } from "antd/lib/cascader";
import { computed, configure, flow, makeObservable, observable } from "mobx";
import { CascaderContainerProps } from "../../typings/CascaderProps";
import { OptionItem } from "./objects/OptionItem";

configure({ enforceActions: "observed", isolateGlobalState: true, useProxies: "never" });

export class Store {
    optionItems: Map<string, OptionItem> = new Map();

    public dispose() {
        this.optionItems.forEach(d => d.dispose());
        this.optionItems = new Map();
    }

    rootGuids?: string[];
    loadWrapper: (selectedOptions?: CascaderOptionType[]) => void;

    constructor(public mxObject: mendix.lib.MxObject, public mxOption: CascaderContainerProps) {
        makeObservable(this, { options: computed, load: flow.bound, optionItems: observable, rootGuids: observable });
        this.loadWrapper = this.load.bind(this);
        this.load();
    }

    public get options(): CascaderOptionType[] | undefined {
        return this.rootGuids?.map(d => this.optionItems.get(d)!.cascaderOption);
    }

    *load(selectedOptions?: CascaderOptionType[]) {
        if (!selectedOptions) {
            const mxOption = this.mxOption.options[0];
            const guids: string[] = yield fetchByXpath(this.mxObject, mxOption.nodeEntity, "").then(objs =>
                objs?.map(d => d.getGuid())
            );
            this.loadGroup(guids, 0);
        } else {
            const mxOption = this.mxOption.options[selectedOptions.length];
            const option = selectedOptions[selectedOptions.length - 1];
            const guids: string[] = yield fetchByXpath(
                this.mxObject,
                mxOption.nodeEntity,
                `[${getReferencePart(mxOption.relationNodeParent, "referenceAttr")}=${option.value}]`
            ).then(objs => objs?.map(d => d.getGuid()));
            this.loadGroup(guids, selectedOptions.length, option.value as string);
        }
    }
    loadGroup(guids: string[], idx: number, guid?: string) {
        guids.forEach(d => {
            this.optionItems.set(d, new OptionItem(this, d, idx));
        });
        if (guid) {
            this.optionItems.get(guid)!.childGuids = guids;
        } else {
            this.rootGuids = guids;
        }
    }
}
