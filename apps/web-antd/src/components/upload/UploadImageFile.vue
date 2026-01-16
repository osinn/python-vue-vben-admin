<script lang="ts" setup>
import { ref, watch } from 'vue';

import { Plus } from '@vben/icons';

import { Upload } from 'ant-design-vue';

import { uploadImage } from '#/api/common/indexApi';
import usePreviewImg from '#/components/image/ImagePreview';
import { notification } from '#/components/message/useMessage';

const props = defineProps({
  style: {
    type: Object,
    default: () => {},
  },
  uploadText: {
    type: String,
    default: '上传图片',
  },
  // 图片集合（初始化）
  files: {
    type: Array,
    required: false,
    default: () => [],
  },
  // 最多上传N张图片
  maxNum: {
    type: Number,
    default: 3,
  },
  // 是否支持多图片上传
  multiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'beforeUpload',
  'remove',
  'uploadSuccess',
  'uploadError',
  'change',
]);

const previewImage = usePreviewImg();

const loading = ref(false);
const fileList = ref<any[]>([]);
const maxNum = ref(props.maxNum);
const uploadText = ref(props.uploadText);

// 图片预览
function handlePreview(file: any) {
  previewImage.show({
    list: [file.url || file.thumbUrl],
  });
}

// 上传之前判断文件类型
function beforeUpload(file: any) {
  emit('beforeUpload', file);
  let isJPG = false;
  const picTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/tif'];
  picTypes.forEach((item) => {
    if (file.type.toLocaleLowerCase() === item) {
      isJPG = true;
    }
  });
  if (!isJPG) {
    notification.error('请上传图片类型：jpeg/png/bmp/tif');
    return false;
  }
}

// 删除图片
function remove(file: any) {
  const fileLists = fileList.value.filter((item: any) => {
    return item.url !== file.url;
  });
  fileList.value = !fileLists || fileLists.length === 0 ? [] : fileLists;
  emit('change', fileList.value);
  emit('remove', fileList.value);
}

async function handleUpload(data: any) {
  loading.value = true;
  try {
    const { file } = data;
    emit('beforeUpload', file);
    // blob方式预览图片
    // this.imageUrl = window.URL.createObjectURL(file)
    // 组装数据
    const formData = new FormData();
    formData.append('file', file);
    await uploadImage(file)
      .then((res: any) => {
        // data.onSuccess(res.fullFilePath);
        const url = res?.fullFilePath;
        fileList.value.push({
          status: 'done',
          url,
          uid: file.uid,
        });
        emit('change', fileList.value);
        emit('uploadSuccess', fileList.value);
      })
      .catch((error: any) => {
        data.onError();
        emit('uploadError', error);
      });
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.files,
  (list) => {
    const fileListArray = [];
    for (const url of list) {
      fileListArray.push({
        status: 'done',
        url,
        uid: url,
      });
    }
    fileList.value = fileListArray;
  },
  { deep: true, immediate: true },
);
</script>
<template>
  <div class="clearfix" :style="style">
    <Upload
      accept="image/*"
      list-type="picture-card"
      :multiple="multiple"
      :file-list="fileList"
      @preview="handlePreview"
      :remove="remove"
      :before-upload="beforeUpload"
      :custom-request="handleUpload"
    >
      <div v-if="fileList.length < maxNum">
        <Plus class="mx-auto size-5 w-fit" />
        <div v-if="loading" v-loading="loading">
          <div class="ant-upload-text">正在上传...</div>
        </div>
        <div v-else class="ant-upload-text">
          {{ uploadText }}
        </div>
      </div>
    </Upload>
  </div>
</template>
