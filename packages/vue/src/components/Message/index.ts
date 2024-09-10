import { createVNode, render, shallowRef } from 'vue';
import type { VNode } from 'vue';
import Message from './index.vue';

const MAX_MESSAGE_COUNT = 10;
export const CURRENT_MESSAGE_COUNT = shallowRef(0);
const messageInstances: {
  id: string;
  vnode: VNode;
  handler: {
    close: () => void;
  };
}[] = [];

export interface MessageProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

function mountMessage(props: MessageProps) {
  const container = document.createElement('div');
  const id = `message_${CURRENT_MESSAGE_COUNT.value}`;
  const vnode = createVNode(Message, {
    ...props,
    id,
    onDestory: () => {
      CURRENT_MESSAGE_COUNT.value--;
      render(null, container);
    },
  });

  render(vnode, container);
  document.body.appendChild(container.firstElementChild!);

  const instance = {
    id,
    vnode,
    handler: {
      close: () => {
        vnode.component!.exposed!.show.value = false;
      },
    },
  };

  messageInstances.push(instance);
}

function message(props: MessageProps) {
  props = {
    type: props.type ?? 'info',
    duration: props.duration ?? 1500,
    message: props.message,
  };
  if (CURRENT_MESSAGE_COUNT.value >= MAX_MESSAGE_COUNT && messageInstances.length) {
    const firstMessage = messageInstances.shift()!;
    firstMessage.handler.close();
  }

  CURRENT_MESSAGE_COUNT.value++;
  mountMessage(props);
}

message.info = (props: Omit<MessageProps, 'type'>) => {
  return message({ type: 'info', ...props });
};
message.success = (props: Omit<MessageProps, 'type'>) => {
  return message({ type: 'success', ...props });
};
message.error = (props: Omit<MessageProps, 'type'>) => {
  return message({ type: 'error', ...props });
};

export { message };
