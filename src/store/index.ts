import { CascaderOptionType } from "antd/lib/cascader";
import { configure, flow, makeObservable, observable } from "mobx";
import { OptionItem } from "./objects/OptionItem";

configure({ enforceActions: "observed", isolateGlobalState: true, useProxies: "never" });

export class Store {
    optionItems: OptionItem[];
    /**
     * dispose
     */
    public dispose() {}

    constructor() {
        this.optionItems = [];
        makeObservable(this, { options: observable, load: flow.bound });
    }

    public options: CascaderOptionType[] | undefined = [
        {
            value: "zhejiang",
            label: "Zhejiang",
            isLeaf: false
        },
        {
            value: "jiangsu",
            label: "Jiangsu",
            isLeaf: false
        }
    ];

    *load(selectedOptions?: CascaderOptionType[]) {
        if (!selectedOptions) {
            return;
        }
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        targetOption.children = yield new Promise<CascaderOptionType[]>((resolve, _reject) => {
            setTimeout(() => {
                resolve([
                    {
                        label: `${targetOption.label} Dynamic 1`,
                        value: "dynamic1"
                    },
                    {
                        label: `${targetOption.label} Dynamic 2`,
                        value: "dynamic2"
                    }
                ]);
            }, 1000);
        });

        targetOption.loading = false;
        this.options = [...this.options!];
    }
}
