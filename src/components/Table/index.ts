import BasicTable from './src/BasicTable.vue';
import TableAction from './src/components/TableAction.vue';
import TableSwitch from './src/components/TableSwitch.vue';

export * from './src/types/table';
export * from './src/types/pagination';
export * from './src/types/tableAction';

export { useTable } from './src/hooks/useTable';

export { BasicTable, TableAction, TableSwitch };

export type { FormSchema, FormProps } from '/@/components/Form/src/types/form';
