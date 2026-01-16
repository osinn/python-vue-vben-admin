# 使用

- 导入组件 `import UploadImageFile from '#/components/upload/UploadImageFile.vue';`
- 调用

```
// 上传前调用
function beforeUpload(file: any) {
  // 清除表单字段验证
  // clearValidate("imgUrl");
  console.log('上传前调用 -----> ');
}
// 上传失败调用
function uploadError() {
  // 设置验证表单字段
  // validateFields(["imgUrl"]);
  console.log('上传失败调用 -----> ');
}

function uploadSuccess(file: UploadImageItem[]) {
  console.log('上传成功 ----->', file);
  formApi.setFieldValue('imgUrl', file[0]?.url);
}


<UploadImageFile
  ref="UploadImage"
  :files="thumbnails" // 默认回显图片列表
  @before-upload="beforeUpload"
  @upload-error="uploadError"
  @upload-success="uploadSuccess"
/>
```
