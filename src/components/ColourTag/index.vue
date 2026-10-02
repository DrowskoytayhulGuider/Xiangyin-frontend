<template>
  <el-tag
      :style="{ background, borderColor: 'transparent'}"
      :title="list.join(', ')"
      style="min-width: 50px"
  />
</template>

<script setup lang="ts" name="ColourTag">
// import { computed } from 'vue';
import { colourBackground, toColours } from '/@/views/dialect/dialectClassify/colour';

const props = withDefaults(
    defineProps<{ value?: string | string[] | null; showText?: boolean; separator?: string }>(),
    { showText: false, separator: ' → ' }
);

const list = computed(() => toColours(props.value));
const background = computed(() => colourBackground(props.value));
</script>