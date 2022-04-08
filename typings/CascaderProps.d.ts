/**
 * This file was generated from Cascader.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { CSSProperties } from "react";
import { ActionPreview } from "@mendix/pluggable-widgets-typing-generator/dist/typings";

interface CommonProps {
    name: string;
    class: string;
    tabIndex: number;

    uniqueid: string;
    friendlyId?: string;
    mxform: mxui.lib.form._FormBase;
    mxObject?: mendix.lib.MxObject;
    style: string;
}

export interface OptionsType {
    parentNodeEntity: string;
    nodeEntity: string;
    relationNodeParent: string;
    labelAttribute: string;
    relationNodeSelect: string;
    onLoad: string;
}

export interface OptionsVisibilityType {
    parentNodeEntity: boolean;
    nodeEntity: boolean;
    relationNodeParent: boolean;
    labelAttribute: boolean;
    relationNodeSelect: boolean;
    onLoad: boolean;
}

export interface CascaderContainerProps extends CommonProps {
    options: OptionsType[];

    eventNodeOnClickAction: FullAction;
    eventNodeClickFormat: ClickType;
    eventNodeOnClickMicroflow: string;
    eventNodeOnClickNanoflow: Nanoflow;
    eventNodeOnClickForm: string;
    eventNodeOnClickOpenPageAs: OpenPageAs;
    defaultValue: string;
}

export interface CascaderPreviewProps {
    class: string;
    style: string;
    styleObject: CSSProperties;
    options: OptionsType[];
}

export interface VisibilityMap {
    options: OptionsVisibilityType[] | boolean;
}
