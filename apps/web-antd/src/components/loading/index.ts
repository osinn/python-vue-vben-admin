import { loadingService } from './loadingService';

export interface ILoadingInstance {
  close: () => void;
}

export type LoadingKey = string | symbol;

export interface IMultiLoadingService {
  show(text?: string, key?: LoadingKey): void;
  hide(key: LoadingKey): void;
  hideAll(): void;
  getInstance(key: LoadingKey): ILoadingInstance | undefined;
}

class MultiLoadingService implements IMultiLoadingService {
  private instances: Map<LoadingKey, ILoadingInstance> = new Map();

  constructor() {}

  getActiveKeys(): LoadingKey[] {
    return [...this.instances.keys()];
  }

  getInstance(key: LoadingKey): ILoadingInstance | undefined {
    return this.instances.get(key);
  }

  hide(key: LoadingKey = 'myLoadingKey'): void {
    const instance = this.instances.get(key);
    if (instance) {
      instance.close();
      this.instances.delete(key);
    }
  }

  // setText(key: LoadingKey, text: string): void {
  //   const instance = this.instances.get(key)
  //   if (instance) {
  //     instance.setText(text)
  //   }
  // }

  hideAll(): void {
    this.instances.forEach((instance) => instance.close());
    this.instances.clear();
  }

  show(text?: string, key?: LoadingKey): void {
    key = 'myLoadingKey';
    if (!key) {
      key = 'myLoadingKey'; // 默认key
    }
    this.hide(key); // 先关闭同key的实例
    const instance = loadingService({
      tip: text || '请稍后...',
    }) as ILoadingInstance;

    this.instances.set(key, instance);
  }
}

// 默认实例
const useLoading = new MultiLoadingService();

export { MultiLoadingService, useLoading };
