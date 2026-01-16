<script setup lang="ts">
import { computed } from 'vue';

import { Tag } from 'ant-design-vue';

interface DictTag {
  label: string;
  value: boolean | null | number | string | undefined;
  type?: string;
}

interface Props {
  dicts: DictTag[]; // dict数组
  value: boolean | null | number | string | undefined;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  dicts: undefined,
  label: undefined,
});

const color = computed<string>(() => {
  const current = props.dicts.find((item) => item.value === props.value);

  return current?.type ?? 'processing';
});

const cssClass = computed<string>(() => {
  const current = props.dicts.find((item) => item.value === props.value);
  return current?.type ?? '';
});

const label = computed<number | string>(() => {
  const current = props.dicts.find((item) => item.value === props.value);
  return props.label ?? current?.label ?? 'unknown';
});

const tagComponent = computed(() => (color.value ? Tag : 'div'));
</script>

<template>
  <div>
    <component
      :is="tagComponent"
      :type="color"
      :class="cssClass"
      :color="color"
    >
      {{ label }}
    </component>
  </div>
</template>
