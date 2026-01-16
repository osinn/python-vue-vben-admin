<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { Card, Col, Row } from 'ant-design-vue';

import { getMonitorServerInfo } from '#/api/basis/monitor/monitorServer';

const server = ref<any>({});
const accessStore = useAccessStore();
// onMounted(async () => {
//   server.value = await getMonitorServerInfo();
// });

const timer = ref();

const loading = ref(false);

const fetchData = async () => {
  try {
    if (loading.value) {
      return;
    }
    loading.value = true;
    server.value = await getMonitorServerInfo();
  } finally {
    loading.value = false;
  }
};
const evtSource = ref();

const loadInfo = ref(true);

function formatToken(token: null | string) {
  return token ? `Bearer ${token}` : null;
}
const initEventSource = () => {
  if (typeof EventSource === 'undefined') {
    console.log('当前浏览器不支持使用EventSource接收服务器推送事件!');
  } else {
    const authorization = formatToken(accessStore.accessToken);
    evtSource.value = new EventSource(
      `/api/sse-connect?clientId=monitorServerInfoEvent&Authorization=${
        authorization
      }`,
      { withCredentials: true },
    ); // 后端接口，要配置允许跨域属性
    // 与事件源的连接刚打开时触发
    evtSource.value.addEventListener('open', (e: any) => {
      console.log('与事件源的连接刚打开时触发====>', e);
    });

    // 当从事件源接收到数据时触发
    evtSource.value.onmessage = function (e: any) {
      console.log(e);
    };
    // 与事件源的连接无法打开时触发
    evtSource.value.onerror = async function (e: any) {
      console.log('与事件源的连接无法打开时触发====>', e);
      await evtSource.value.close(); // 关闭连接
      evtSource.value = null;
      setTimeout(() => {
        console.log('尝试重连定时任务');
        if (!evtSource.value) {
          console.log('尝试重连 SSE...');
          initEventSource();
        }
      }, 2000);
    };
    // 也可以侦听命名事件，即自定义的事件
    evtSource.value.addEventListener('monitorServerInfoEvent', (e) => {
      server.value = JSON.parse(e.data);
      if (loadInfo.value) {
        loadInfo.value = false;
      }
    });
  }
};

// 组件挂载时启动定时任务
onMounted(() => {
  // fetchData(); // 立即执行一次
  // timer.value = setInterval(fetchData, 2000);

  // const eventSource = new EventSource('/api/sse-connect?userId=1', { withCredentials: true });

  // eventSource.onmessage = function(event) {
  //   console.log('收到消息：', event.data);
  //   // 可更新到页面上
  // };

  // eventSource.onerror = function(err) {
  //   console.error('连接出错', err);
  //   // 可以展示连接断开的提示
  // };

  initEventSource();
});

// 组件卸载时清除定时任务
onUnmounted(async () => {
  if (evtSource.value) {
    await evtSource.value.close(); // 关闭连接 showHeader
    evtSource.value = null;
  }
});
</script>

<template>
  <Page auto-content-height v-spinning="loadInfo">
    <Row>
      <Col :span="12" class="card-box mb-2">
        <Card>
          <template #title>
            <div>
              <span><i class="el-icon-cpu"></i> CPU</span>
            </div>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr class="ant-table-row ant-table-row-level-0">
                  <th class="ant-table-cell">
                    <div class="cell">属性</div>
                  </th>
                  <th class="ant-table-cell">
                    <div class="cell">值</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">核心数</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.cpu" class="cell">
                      {{ server.cpu.cpuNum }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">用户使用率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.cpu" class="cell">
                      {{ server.cpu.used }}%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">系统使用率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.cpu" class="cell">
                      {{ server.cpu.sys }}%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">当前空闲率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.cpu" class="cell">
                      {{ server.cpu.free }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Col>

      <Col :span="12" class="card-box mb-2">
        <Card>
          <template #title>
            <div>
              <span><i class="el-icon-tickets"></i> 内存</span>
            </div>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">属性</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">内存</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">JVM</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">总内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.mem" class="cell">
                      {{ server.mem.total }}G
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.jvm" class="cell">
                      {{ server.jvm.total }}M
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">已用内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.mem" class="cell">
                      {{ server.mem.used }}G
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.jvm" class="cell">
                      {{ server.jvm.used }}M
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">剩余内存</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.mem" class="cell">
                      {{ server.mem.free }}G
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.jvm" class="cell">
                      {{ server.jvm.free }}M
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">使用率</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="server.mem"
                      class="cell"
                      :class="{ 'text-danger': server.mem.usage > 80 }"
                    >
                      {{ server.mem.usage }}%
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      v-if="server.jvm"
                      class="cell"
                      :class="{ 'text-danger': server.jvm.usage > 80 }"
                    >
                      {{ server.jvm.usage }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Col>

      <Col :span="24" class="card-box mb-2">
        <Card>
          <template #title>
            <div>
              <span><i class="el-icon-monitor"></i> 服务器信息</span>
            </div>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">服务器名称</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.sys" class="cell">
                      {{ server.sys.computerName }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">操作系统</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.sys" class="cell">
                      {{ server.sys.osName }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">服务器IP</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.sys" class="cell">
                      {{ server.sys.computerIp }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">系统架构</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.sys" class="cell">
                      {{ server.sys.osArch }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Col>

      <Col :span="24" class="card-box mb-2">
        <Card>
          <template #title>
            <div>
              <span><i class="el-icon-coffee-cup"></i> Java虚拟机信息</span>
            </div>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%; table-layout: fixed">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">Java名称</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.jvm" class="cell">
                      {{ server.jvm.name }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">Java版本</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.jvm" class="cell">
                      {{ server.jvm.version }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">启动时间</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.jvm" class="cell">
                      {{ server.jvm.startTime }}
                    </div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">运行时长</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div v-if="server.jvm" class="cell">
                      {{ server.jvm.runTime }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" class="el-table__cell is-leaf">
                    <div class="cell">安装路径</div>
                  </td>
                  <td colspan="3" class="el-table__cell is-leaf">
                    <div v-if="server.jvm" class="cell">
                      {{ server.jvm.home }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" class="el-table__cell is-leaf">
                    <div class="cell">项目路径</div>
                  </td>
                  <td colspan="3" class="el-table__cell is-leaf">
                    <div v-if="server.sys" class="cell">
                      {{ server.sys.userDir }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="1" class="el-table__cell is-leaf">
                    <div class="cell">运行参数</div>
                  </td>
                  <td colspan="3" class="el-table__cell is-leaf">
                    <div v-if="server.jvm" class="cell">
                      {{ server.jvm.inputArgs }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Col>

      <Col :span="24" class="card-box mb-2">
        <Card>
          <template #title>
            <div>
              <span><i class="el-icon-receiving"></i> 磁盘状态</span>
            </div>
          </template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="el-table__cell el-table__cell is-leaf">
                    <div class="cell">盘符路径</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">文件系统</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">盘符类型</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">总大小</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">可用大小</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">已用大小</div>
                  </th>
                  <th class="el-table__cell is-leaf">
                    <div class="cell">已用百分比</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="server.sysFiles">
                <tr v-for="(sysFile, index) in server.sysFiles" :key="index">
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.dirName }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.sysTypeName }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.typeName }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.total }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.free }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div class="cell">{{ sysFile.used }}</div>
                  </td>
                  <td class="el-table__cell is-leaf">
                    <div
                      class="cell"
                      :class="{ 'text-danger': sysFile.usage > 80 }"
                    >
                      {{ sysFile.usage }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </Col>
    </Row>
  </Page>
</template>
