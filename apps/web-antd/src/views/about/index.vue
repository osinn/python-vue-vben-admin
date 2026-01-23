<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { VBEN_GITHUB_URL } from '@vben/constants';

interface AboutProps {
  description?: string;
  name?: string;
  title?: string;
}

interface Props extends AboutProps {}

defineOptions({
  name: 'AboutUI',
});

withDefaults(defineProps<Props>(), {
  description:
    'Python FastAPI + vue3 前后端分离后台管理系统。PC 端使用：Vben Admin 5.0 框架，Vben Admin 是一个基于 ant-design-vue、Vue3.0、Vite、 TypeScript 的中后台解决方案。接口使用：FastAPI+Pydantic+SQLAlchemy 2.0+Mysql+redis+apscheduler+JWT。RBAC 权限管理，定时任务，部门管理等功能',
  name: '',
  title: '关于项目',
});

const { devDependencies = {} } = {
  devDependencies: {
    Python: 'v3.13.11',
    APScheduler: 'v3.11.2',
    FastAPI: 'v0.124.2',
    SQLAlchemy: 'v2.0.45',
    Redis: 'v7.1.0',
    MySQL: 'v5.7.+',
    'Github 后端项目': 'https://github.com/osinn/python-admin-vben-fastapi',
    'Github 前端项目': 'https://github.com/osinn/python-vue-vben-admin',
  },
};

const devDependenciesItems = Object.keys(devDependencies).map((key) => ({
  content: devDependencies[key],
  title: key,
}));
</script>

<template>
  <Page :title="title">
    <template #description>
      <p class="mt-3 text-sm leading-6 text-foreground">
        <a :href="VBEN_GITHUB_URL" class="vben-link" target="_blank">
          {{ name }}
        </a>
        {{ description }}
      </p>
    </template>

    <div class="card-box mt-6 p-5">
      <div>
        <h5 class="text-lg text-foreground">开发环境依赖</h5>
      </div>
      <div class="mt-4">
        <dl class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <template v-for="item in devDependenciesItems" :key="item.title">
            <div class="border-t border-border px-4 py-3 sm:col-span-1 sm:px-0">
              <dt class="text-sm text-foreground">
                <span v-if="!item.content.includes('https://')">
                  {{ item.title }}
                </span>
              </dt>
              <dd class="mt-1 text-sm text-foreground/80 sm:mt-2">
                <a
                  v-if="item.content.includes('https://')"
                  :href="item.content"
                  class="vben-link"
                  target="_blank"
                  >{{ item.title }}</a>
                <span v-else>
                  {{ item.content }}
                </span>
              </dd>
            </div>
          </template>
        </dl>
      </div>
    </div>
  </Page>
</template>
