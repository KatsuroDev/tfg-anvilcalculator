<template>
  <v-card class="w-100 py-4 my-2">
    <v-container>
      <v-row>
        <v-col cols="3">
          <h2 class="text-h6">{{ model.material }}</h2>
        </v-col>

        <v-col cols="9">
          <p>{{ stepsDisplay }}</p>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import AnvilResultModel from "@/models/AnvilResultModel";

const props = defineProps({
  model: {
    type: AnvilResultModel,
    required: true,
  },
});

const stepsDisplay = ref("");

let times = 0;
props.model.steps.forEach((step, index) => {
  if (index === 0) {
    times++;
    return;
  }

  const previous = props.model.steps[index - 1];

  if (step === previous) times++;
  else {
    stepsDisplay.value = stepsDisplay.value.concat(
      times + "x " + previous + " - ",
    );
    times = 1;
  }

  if (props.model.steps.length === index + 1) {
    stepsDisplay.value = stepsDisplay.value.concat(times + "x " + step);
    times = 0;
  }
});

console.log(props.model);
console.log(times);
</script>
