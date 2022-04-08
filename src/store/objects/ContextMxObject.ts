import { makeObservable, observable } from "mobx";
import { Store } from "..";
import { BaseMxObject } from "./BaseMxObject";

export class ContextMxObject extends BaseMxObject {
    defaultValue: string[] = [];
    sub2: mx.Subscription;
    constructor(public store: Store, guid: string) {
        super(guid);
        makeObservable(this, { defaultValue: observable });
        this.onChange = () => {
            const ds = this.mxObject?.get(store.mxOption.defaultValue) as string;
            this.defaultValue = !!ds ? ds.split("/") : [];
        };
        this.onChange(this.guid);

        this.sub2 = mx.data.subscribe({
            guid: guid,
            attr: store.mxOption.defaultValue,
            callback: (guid, attr, attrValue) => {
                console.log(guid, attr, attrValue);
                this.onChange!(guid.toString());
            }
        });
    }

    public dispose(): void {
        super.dispose();
        if (this.sub2) {
            mx.data.unsubscribe(this.sub2);
        }
    }
}
