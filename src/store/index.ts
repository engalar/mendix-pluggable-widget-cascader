import { executeMicroflow, fetchByXpath, getObjectContext, getReferencePart } from "@jeltemx/mendix-react-widget-utils";
import { CascaderOptionType } from "antd/lib/cascader";
import { autorun, computed, configure, flow, makeObservable, observable } from "mobx";
import { CascaderContainerProps, OptionsType } from "../../typings/CascaderProps";
import { ContextMxObject } from "./objects/ContextMxObject";
import { OptionItem } from "./objects/OptionItem";

configure({ enforceActions: "observed", isolateGlobalState: true, useProxies: "never" });

export class Store {
    optionItems: Map<string, OptionItem> = new Map();
    ctx: ContextMxObject;
    t = new Map<string, string>();

    public dispose() {
        this.optionItems.forEach(d => d.dispose());
        this.optionItems = new Map();
    }

    rootGuids?: string[];
    loadWrapper: (selectedOptions?: CascaderOptionType[]) => void;

    constructor(public mxObject: mendix.lib.MxObject, public mxOption: CascaderContainerProps) {
        makeObservable(this, {
            options: computed,
            load: flow.bound,
            optionItems: observable,
            rootGuids: observable
        });
        this.ctx = new ContextMxObject(this, mxObject.getGuid());
        this.loadWrapper = this.load.bind(this);
        this.load();


        autorun(() => {
            this.t = new Map<string, string>();
            this.options?.forEach((v, i) => {
                this.t.set(v.value as string, this.rootGuids![i]!);
            });
        })
    }

    public get options(): CascaderOptionType[] | undefined {
        return this.rootGuids?.map(d => this.optionItems.get(d)!.cascaderOption);
    }

    /**
     * 有两种情况
     * 1）普通
     * 2）默认已经选中的若干选项，但实际下拉选项还未加载
     * @param selectedOptions 选中的选项列表
     */
    *load(selectedOptions?: CascaderOptionType[]) {
        if (!selectedOptions) {
            const mxOption = this.mxOption.options[0];
            const guids: string[] = yield this.fetchGroup(this.mxObject, mxOption, "");
            this.loadGroup(guids, 0);
            if (this.ctx.defaultValue.length > 1) {
                for (let index = 0; index < this.ctx.defaultValue.length - 1; index++) {
                    const guids: string[] = yield this.loadLevel(this.mxOption.options[index + 1], this.ctx.defaultValue[index]);
                    this.loadGroup(guids, index + 1, this.t.get(this.ctx.defaultValue[index]) as string);
                }
            }
        } else {
            const mxOption = this.mxOption.options[selectedOptions.length];
            const option = selectedOptions[selectedOptions.length - 1];
            const guid = this.t.get(option.value as string)!;

            const guids: string[] = yield this.loadLevel(mxOption, option.value as string);
            this.loadGroup(guids, selectedOptions.length, guid as string);
        }
    }
    loadLevel(mxOption: OptionsType, value: string) {
        const guid = this.t.get(value as string)!;
        return this.fetchGroup(
            this.mxObject,
            mxOption,
            `[${getReferencePart(mxOption.relationNodeParent, "referenceAttr")}=${guid}]`
        );
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

    /**
     * 优先使用微流加载数据，否则回落到用xpath
     * @param obj
     * @param option
     * @param constraint
     * @returns
     */
    fetchGroup(obj: mendix.lib.MxObject, option: OptionsType, constraint: string) {
        if (option.onLoad) {
            return executeMicroflow(
                option.onLoad,
                getObjectContext(obj),
                this.mxOption.mxform
            ).then((objs: mendix.lib.MxObject[] | null) => objs?.map(d => d.getGuid()));
        }
        return fetchByXpath(obj, option.nodeEntity, constraint).then(objs => objs?.map(d => d.getGuid()));
    }
}
