import { Component } from 'vue';
import {
	ElInput,
	ElDatePicker,
	ElTreeSelect,
	ElInputNumber,
	ElSelect,
	ElTree,
	ElOption
} from 'element-plus';
import RadioButtonGroup from '/@/components/RadioButtonGroup';
import { ApiSelect } from '/@/components/ApiSelect';
import { AreaSelect } from '/@/components/AreaSelect';
import { IconSelector } from '/@/components/Icon';
import { BasicUpload } from '/@/components/Upload';
import { DictSelect } from '/@/components/DictSelect';
import { ComponentType } from './types';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', ElInput);
componentMap.set('DatePicker', ElDatePicker);
componentMap.set('RadioButtonGroup', RadioButtonGroup);
componentMap.set('TreeSelect', ElTreeSelect);
componentMap.set('InputNumber', ElInputNumber);
componentMap.set('Select', ElSelect);
componentMap.set('Option', ElOption);
componentMap.set('IconSelector', IconSelector);
componentMap.set('Tree', ElTree);
componentMap.set('ApiSelect', ApiSelect);
componentMap.set('AreaSelect', AreaSelect);
componentMap.set('DictSelect', DictSelect);
componentMap.set('Upload', BasicUpload);

export { componentMap };
