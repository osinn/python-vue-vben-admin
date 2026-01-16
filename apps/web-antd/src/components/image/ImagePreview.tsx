import type { RendererElement, RendererNode, VNode, VNodeProps } from 'vue';

import { cloneVNode, createVNode, ref, render as vueRender } from 'vue';

import { Image, ImagePreviewGroup } from 'ant-design-vue';

interface PreviewConfig {
  visible?: boolean | { value: boolean };
  current?: number;
  list?: string[];
  [key: string]: any;
}

interface PreviewInstance {
  show: (config: PreviewConfig) => void;
  vnode: VNode<RendererNode, RendererElement, { [key: string]: any }>;
}

let instance: null | PreviewInstance = null;

function usePreviewImg() {
  if (instance) {
    return instance;
  }

  const container = document.createElement('div');
  document.body.append(container);

  function show(config: PreviewConfig) {
    if (!instance) {
      throw new Error('Instance not initialized');
    }
    const visible = ref(true);
    const cloneConfig: VNodeProps & { [key: string]: any } = {
      ...config,
      visible,
    };
    const newVm = cloneVNode(instance.vnode, cloneConfig);
    vueRender(newVm, container);
  }

  const Wrapper = (attr: PreviewConfig = {}) => {
    const visible = attr.visible;
    const current = attr.current;
    const list = attr.list || [];

    const onVisibleChangeHandle = () => {
      if (visible && typeof visible !== 'boolean') {
        (visible as { value: boolean }).value = false;
      }
    };

    return (
      <div data-mark="image-preview" style="display: none;">
        <ImagePreviewGroup
          preview={{
            visible:
              visible && typeof visible !== 'boolean'
                ? (visible as { value: boolean }).value
                : visible,
            onVisibleChange: onVisibleChangeHandle,
            current,
          }}
        >
          {list.map((item, index) => (
            <Image key={index} src={item} width="200" />
          ))}
        </ImagePreviewGroup>
      </div>
    );
  };

  function render() {
    const vm = createVNode(Wrapper);
    vueRender(vm, container);
    return vm;
  }

  const vnode = render() as VNode<
    RendererNode,
    RendererElement,
    { [key: string]: any }
  >;

  instance = {
    show,
    vnode,
  };

  return instance;
}

export default usePreviewImg;
