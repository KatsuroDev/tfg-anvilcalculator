<template>
  <v-container class="fill-height" max-width="1500">
    <div class="w-100">
      <v-row>
        <v-col cols="12">
          <v-img class="mb-4" height="200" src="@/assets/tfg-logo.png" />
        </v-col>
        <v-col cols="12">
          <div class="mb-8 text-center">
            <h1 class="text-h2 font-weight-bold">TFG Anvil Calculator</h1>
          </div>
        </v-col>
      </v-row>
      <v-row class="mb-8">
        <v-col cols="3">
          <v-text-field v-model="model.material" label="What are you making?" />
        </v-col>

        <v-col cols="2">
          <v-number-input
            v-model="model.target"
            label="Target"
            control-variant="split"
            inset
            :min="-2"
            :max="146"
          />
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="model.lastSteps[0]"
            label="Last step"
            :items="Techniques"
            clearable
          />
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="model.lastSteps[1]"
            label="Second-to-last step"
            :items="Techniques"
            clearable
          />
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="model.lastSteps[2]"
            label="Third-to-last step"
            :items="Techniques"
            clearable
          />
        </v-col>

        <v-col cols="1">
          <v-btn icon="mdi-plus" @click="CreateResult"/>
        </v-col>
      </v-row>

      <v-row v-for="result in results" :key="result.uuid">
        <AnvilResult :model="result" @delete-result="(deletedResult) => DeleteResult(deletedResult)" />
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import AnvilResult from "./AnvilResult.vue";
import AnvilResultModel from "@/models/AnvilResultModel";
import AnvilResultRepository from "@/repositories/AnvilResult.repository";
import MaterialCreateModel from "@/models/MaterialCreateModel";
import Techniques from "@/models/Techniques.ts";

const model = reactive(new MaterialCreateModel());
const results = ref(new Array<AnvilResultModel>());

onMounted(() => {
	GetResults();
});

function CreateResult() {
	const newResult = new AnvilResultModel(model);
	AnvilResultRepository.Save(newResult);
	results.value.push(newResult);
}

function DeleteResult(uuid: string) {
	AnvilResultRepository.Delete(uuid);
	const index = results.value.findIndex((item: AnvilResultModel) => item.uuid === uuid);
	results.value.splice(index, 1);
}

function GetResults()
{
	results.value = AnvilResultRepository.GetAll()!;
}

</script>
