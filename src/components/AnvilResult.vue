<template>
  <v-card @click="onCardClick()"
          link
          :class="['w-100', 'py-4', 'my-2', {'bg-grey-darken-2': props.isSelected}]"
          :elevation="props.elevation"
          >
      <v-row class="px-8" align="center">
        <v-col cols="3" class="d-flex align-center">
          <h2 class="text-h6">{{ model.material }}</h2>
        </v-col>

        <v-col cols="auto me-auto" class="d-flex align-center flex-wrap">
          <div v-for="[value, times] in stepCountsEntries" class="d-flex align-center mr-3 mb-2">
            <span class="text-h5 font-weight-medium mr-1">{{ times }}x </span>
            <v-avatar size="48" class="mr-2" rounded="0">
						  <v-img :src="getImage(Techniques.find(x => x.value === value)!.name)" class="pixel-art"/>
					  </v-avatar>
          </div>
          <div v-for="step in lastStepCountsEntries" class="d-flex align-center mr-3 mb-2">
            <span class="text-h5 font-weight-medium mr-1">{{ step.times }}x </span>
            <v-avatar size="48" class="mr-2" rounded="0">
						  <v-img :src="getImage(Techniques.find(x => x.value === step.value)!.name)" class="pixel-art"/>
					  </v-avatar>
          </div>
        </v-col>

        <v-col cols="auto" class="d-flex align-center justify-end">
          <v-btn color="error" icon="mdi-trash-can-outline" @click="onDeleteClick()"/>
        </v-col>
      </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AnvilResultModel from "@/models/AnvilResultModel";
import Techniques from "@/models/Techniques";

const props = defineProps({
  model: {
    type: AnvilResultModel,
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: false,
  },
  elevation: {
    type: [Number, String],
    default: 2,
  }
});

const stepCountsEntries = computed(() => Array.from(stepCounts.value.entries()));
const lastStepCountsEntries = computed(() => lastStepCounts.value);

const images = import.meta.glob('@/assets/techniques/*.png', { eager: true, import: 'default' }) as Record<string, string>;

function getImage(name: string): string {
  const key = `/src/assets/techniques/${name.toLowerCase().replace(' ', '_')}.png`;
  return images[key] || '';
}

const emit = defineEmits(['delete-result', 'select-result']);

const stepCounts = ref(new Map<number, number>);
const lastStepCounts = ref<Array<{value: number, times: number}>>([]);
const lastSteps = props.model.lastSteps.filter(x => x != undefined).reverse();

const lastIndexTrim = props.model.lastSteps.length !== 0 ? -(props.model.lastSteps.length) : undefined;
const steps = props.model.steps.slice(0, lastIndexTrim);

steps.forEach(step => {
  stepCounts.value.set(step, (stepCounts.value.get(step) || 0) + 1);
});

countLastSteps();

function countLastSteps() {
  if (lastSteps.length === 0) return;

  let current = lastSteps[0];
  let count = 1;

  if (current == steps[steps.length - 1]) {
    count += stepCounts.value.get(current) ?? 0;
    stepCounts.value.delete(current);
  }

  for (let i = 1; i < lastSteps.length; i++) {
    const step = lastSteps[i];

    if (step === current) {
      count++;
    } else {
      lastStepCounts.value.push({ value: current, times: count });
      current = step;
      count = 1;
    }
  }

  lastStepCounts.value.push({ value: current, times: count });
}

function onCardClick()
{
  emit('select-result', props.model.uuid);
}

function onDeleteClick()
{
  emit('delete-result', props.model.uuid);
}

</script>
