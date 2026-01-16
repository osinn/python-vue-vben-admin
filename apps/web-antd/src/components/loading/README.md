# 使用

- 导入组件 `import { useLoading } from '#/components/loading';`
- 调用

```
# 显示
useLoading.show();
# 或
useLoading.show("加载中，请稍后...");
setTimeout(() => {
  # 隐藏
  useLoading.hide();
}, 5000);
```
