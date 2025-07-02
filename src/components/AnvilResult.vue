<template>
  <v-card class="w-100 py-4 my-2">
      <v-row class="px-8">
        <v-col cols="3" class="d-flex align-center">
          <h2 class="text-h6">{{ model.material }}</h2>
        </v-col>

        <v-col cols="8" class="d-flex align-center">
          <p>{{ stepsDisplay }}</p>
        </v-col>

        <v-spacer />

        <v-col class="d-flex align-center justify-center">
          <v-btn color="error" icon="mdi-trash-can-outline" @click="onDeleteClick()"/>
        </v-col>
      </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AnvilResultModel from "@/models/AnvilResultModel";

const props = defineProps({
  model: {
    type: AnvilResultModel,
    required: true,
  },
});

const emit = defineEmits(['delete-result']);

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

function onDeleteClick()
{
  emit('delete-result', props.model.uuid);
}

</script>
