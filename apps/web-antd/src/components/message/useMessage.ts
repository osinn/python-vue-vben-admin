import { notification } from 'ant-design-vue';

interface IMessageService {
  info(message?: string, title?: string): void;
  warning(message?: string, title?: string): void;
  success(message?: string, title?: string): void;
  error(message?: string, title?: string): void;
}

class NotificationService implements IMessageService {
  constructor() {}

  error(message?: string, title: string = '温馨提示'): void {
    notification.error({
      message: title,
      description: message,
    });
  }

  info(message?: string, title: string = '温馨提示'): void {
    notification.info({
      message: title,
      description: message,
    });
  }

  success(message?: string, title: string = '温馨提示'): void {
    notification.success({
      message: title,
      description: message,
    });
  }

  warning(message?: string, title: string = '温馨提示'): void {
    notification.warning({
      message: title,
      description: message,
    });
  }
}

// 默认实例
const useNotification = new NotificationService();

export { useNotification as notification, NotificationService };
