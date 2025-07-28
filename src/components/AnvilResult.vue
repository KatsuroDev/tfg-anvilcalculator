<template>
  <v-card class="w-100 py-4 my-2">
      <v-row class="px-8">
        <v-col cols="3" class="d-flex align-center">
          <h2 class="text-h6">{{ model.material }}</h2>
        </v-col>

        <v-col cols="8" class="d-flex align-center">
          <div v-for="[value, times] in stepCountsEntries" class="d-flex align-center">
            <span class="text-h5">{{ times }}x </span>
            <v-avatar size="48" class="mr-2" rounded="0">
						  <v-img :src="getImage(Techniques.find(x => x.value === value)!.name)" class="pixel-art"/>
					  </v-avatar>
          </div>
          <p class="text-h5 font-weight-medium mr-2">Then</p>
          <div v-for="step in lastStepCountsEntries" class="d-flex align-center">
            <span class="text-h5">{{ step.times }}x </span>
            <v-avatar size="48" class="mr-2" rounded="0">
						  <v-img :src="getImage(Techniques.find(x => x.value === step.value)!.name)" class="pixel-art"/>
					  </v-avatar>
          </div>
        </v-col>

        <v-spacer />

        <v-col class="d-flex align-center justify-center">
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
});

const stepCountsEntries = computed(() => Array.from(stepCounts.value.entries()));
const lastStepCountsEntries = computed(() => lastStepCounts.value);

const images = import.meta.glob('@/assets/techniques/*.png', { eager: true, import: 'default' }) as Record<string, string>;

function getImage(name: string): string {
  const key = `/src/assets/techniques/${name.toLowerCase().replace(' ', '_')}.png`;
  return images[key] || '';
}

const emit = defineEmits(['delete-result']);

const stepCounts = ref(new Map<number, number>);
const lastStepCounts = ref<Array<{value: number, times: number}>>([]);
const steps = props.model.steps.slice(0, -(props.model.lastSteps.length))
let times = 0;

steps.forEach((step, index) => {
  if (index === 0) {
    times++;
    return;
  }

  const previous = props.model.steps[index - 1];

  if (step === previous) times++;
  else {
    stepCounts.value.set(previous, times);
    times = 1;
  }

  if (steps.length === index + 1) {
    stepCounts.value.set(step, times);
    times = 0;
  }
});

const lastSteps = props.model.lastSteps.reverse();
let lastTimes = 0;
lastSteps.forEach((step, index) => {

  if (index === 0) {
    lastTimes++
    return;
  }

  const previous = lastSteps[index - 1];

  if (step === previous) lastTimes++;
  else {
    lastStepCounts.value.push({ value: previous, times: lastTimes });
    lastTimes = 1;
  }

  if (lastSteps.length === index + 1) {
    lastStepCounts.value.push({ value: step, times: lastTimes });
    lastTimes = 0;
  }
});

function onDeleteClick()
{
  emit('delete-result', props.model.uuid);
}

</script>
