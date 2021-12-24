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
     * @param idx option index
     */
    constructor(public store: Store, guid: string, public idx: number) {
        super(guid);
        makeObservable(this, { childGuids: observable, loading: observable, cascaderOption: computed });
    }

    public get cascaderOption(): CascaderOptionType {
        return {
            value: this.guid,
            label: this.mxObject.get(this.store.mxOption.options[this.idx].labelAttribute),
            isLeaf: this.store.mxOption.options.length - 1 === this.idx,
            loading: this.loading,
            children: this.childGuids?.map(d => this.store.optionItems.get(d)!.cascaderOption)
        };
    }
}
