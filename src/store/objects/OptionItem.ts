import { CascaderOptionType } from "antd/lib/cascader";
import { computed, makeObservable, observable } from "mobx";
import { Store } from "..";
import { BaseMxObject } from "./BaseMxObject";

export class OptionItem extends BaseMxObject {
    childGuids?: string[];
    loading = false;
    /**
     *
     * @param guid mxobj guid
     * @param level option index
     */
    constructor(public store: Store, guid: string, public level: number) {
        super(guid);
        makeObservable(this, { childGuids: observable, loading: observable, cascaderOption: computed });
        store.t.set(
            ("" + level + this.mxObject!.get(this.store.mxOption.options[this.level].labelAttribute)) as string,
            guid
        );
    }

    public get cascaderOption(): CascaderOptionType {
        return {
            value: this.mxObject!.get(this.store.mxOption.options[this.level].labelAttribute) as string,
            label: this.mxObject!.get(this.store.mxOption.options[this.level].labelAttribute),
            isLeaf: this.store.mxOption.options.length - 1 === this.level,
            loading: this.loading,
            children: this.childGuids?.map(d => this.store.optionItems.get(d)!.cascaderOption)
        };
    }
}
