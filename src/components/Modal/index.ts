import { withInstall } from '/@/utils';
import './src/index.scss';
import basicModal from './src/BasicModal.vue';

export const BasicModal = withInstall(basicModal);
export { useModalContext } from './src/hooks/useModalContext';
export { useModal, useModalInner } from './src/hooks/useModal';
export * from './src/typing';
