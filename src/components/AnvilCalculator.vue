<template>
  <v-container class="fill-height" max-width="1500">
    <div class="w-100">
      <v-row>
        <v-col cols="12">
          <v-img class="mb-4" height="100" src="@/assets/tfg-logo.png" />
        </v-col>
        <v-col cols="12">
          <div class="mb-8 text-center">
            <h1 class="text-h2 font-weight-bold">TFG Anvil Calculator</h1>
          </div>
        </v-col>
      </v-row>
      <v-row class="mb-8">
        <v-col sm="6" md="3">
          <v-text-field v-model="model.material" label="What are you making?" />
        </v-col>

        <v-col sm="6" md="2">
          <v-number-input
            v-model="model.target"
            label="Target"
            control-variant="split"
            inset
            :min="-2"
            :max="146"
          />
        </v-col>

		<v-col sm="3" md="2">
          <v-select
            v-model="model.lastSteps[0]"
            label="Last step"
            :items="Techniques"
			item-value="value"
            clearable
          >
			<template #item="{ item, props }">
				<v-list-item
					:value="props.value"
					@click="props.onClick!"
					class="d-flex align-center"
				>
					<v-avatar size="48" class="mr-2" rounded="0">
						<v-img :src="getImage(item.raw.name)" class="pixel-art" />
					</v-avatar>
					<span class="text-subtitle-1">
						{{ item.raw.name }}
					</span>
				</v-list-item>
			</template>

			<template #selection="{ item }">
				<div class="d-flex align-center">
					<v-avatar size="24" class="mr-2" rounded="0">
						<v-img :src="getImage(item.raw.name)" class="pixel-art"/>
					</v-avatar>
					<span>
						{{ item.raw.name }}
					</span>
				</div>
			</template>
		  </v-select>
        </v-col>

		<v-col sm="4" md="2">
          <v-select
            v-model="model.lastSteps[1]"
            label="Second-to-last step"
            :items="Techniques"
			item-value="value"
            clearable
          >
			<template #item="{ item, props }">
				<v-list-item
					:value="props.value"
					@click="props.onClick!"
					class="d-flex align-center"
				>
					<v-avatar size="48" class="mr-2" rounded="0">
						<v-img :src="getImage(item.raw.name)" class="pixel-art"/>
					</v-avatar>
					<span class="text-subtitle-1">
						{{ item.raw.name }}
					</span>
				</v-list-item>
			</template>

			<template #selection="{ item }">
				<div class="d-flex align-center">
					<v-avatar size="24" class="mr-2" rounded="0">
						<v-img :src="getImage(item.raw.name)" class="pixel-art"/>
					</v-avatar>
					<span>
						{{ item.raw.name }}
					</span>
				</div>
			</template>
		  </v-select>
        </v-col>

        <v-col sm="4" md="2">
          <v-select
            v-model="model.lastSteps[2]"
            label="Third-to-last step"
            :items="Techniques"
			item-value="value"
            clearable
          >
			<template #item="{ item, props }">
				<v-list-item
					:value="props.value"
					@click="props.onClick!"
					class="d-flex align-center"
				>
					<v-avatar size="48" class="mr-2" rounded="0">
						<v-img :src="getImage(item.raw.name)" class="pixel-art"/>
					</v-avatar>
					<span class="text-subtitle-1">
						{{ item.raw.name }}
					</span>
				</v-list-item>
			</template>

			<template #selection="{ item }">
				<div class="d-flex align-center">
					<v-avatar size="24" class="mr-2" rounded="0">
						<v-img :src="getImage(item.raw.name)" class="pixel-art"/>
					</v-avatar>
					<span>
						{{ item.raw.name }}
					</span>
				</div>
			</template>
		  </v-select>
        </v-col>

        <v-col cols="1">
          <v-btn icon="mdi-plus" @click="createResult"/>
        </v-col>
      </v-row>

	  <div v-if="latestResult != undefined" class="mb-5">
		<v-row class="mb-1">
			<AnvilResult :model="latestResult.model"
				:is-selected="latestResult.selected"
				:key="latestResultKey"
				elevation="6"
				@delete-result="deleteLatestResult()"
				@select-result="(selectedResult) => selectResult(selectedResult)"
				/>
		</v-row>

		<hr />
	  </div>

	  <v-row class="w-33" v-if="results.length > 0">
		<v-text-field
			append-inner-icon="mdi-magnify"
			density="compact"
			label="Search"
			single-line
			variant="solo-filled"
			v-model="searchString"
			/>
	  </v-row>

      <v-virtual-scroll v-if="displayResults.length > 0"
        :height="300"
        :items="displayResults"
        >
        <template v-slot:default="{ item }">
          <AnvilResult :model="item.model"
					 :is-selected="item.selected"
					 :key="item.model.uuid"
					 @delete-result="(deletedResult) => deleteResult(deletedResult)"
					 @select-result="(selectedResult) => selectResult(selectedResult)"
					 />
        </template>
      </v-virtual-scroll>

	  <v-row v-if="results.length > 0 && displayResults.length === 0"
			class="w-33 mx-auto"
		>
		<v-alert 
			text="No results found"
			class="text-center"
		/>
	  </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, watchEffect } from "vue";
import AnvilResult from "./AnvilResult.vue";
import AnvilResultModel from "@/models/AnvilResultModel";
import AnvilResultRepository from "@/repositories/AnvilResult.repository";
import MaterialCreateModel from "@/models/MaterialCreateModel";
import Techniques from "@/models/Techniques.ts";

const images = import.meta.glob('@/assets/techniques/*.png', { eager: true, import: 'default' }) as Record<string, string>;

function getImage(name: string): string {
  const key = `/src/assets/techniques/${name.toLowerCase().replace(' ', '_')}.png`;
  return images[key] || '';
}

const model = reactive(new MaterialCreateModel());
const results = ref(new Array<AnvilResultModel>());

const displayResults = ref<Array<{model: AnvilResultModel, selected: boolean }>>([]);
const latestResult = ref<{model: AnvilResultModel, selected: boolean}>();
const latestResultKey = ref(0);
const searchString = ref("");

watchEffect(() => {
	const newResults = results.value;
	const newSearch = searchString.value;

	if (!newResults) return;

	const sorted = newResults
		.filter(x => {
			if (!newSearch)
				return true;
			return x!.material.toLowerCase().includes(newSearch.toLowerCase());
		})
		.sort((a, b) => {
			return a.material?.toUpperCase().localeCompare(b.material?.toUpperCase());
		});

	displayResults.value = sorted.map(x => ({
		model: x,
		selected: false
	}));
});

onMounted(() => {
	preloadAllTechniqueImage();
	getResults();
});

function modelReset() {
	Object.assign(model, new MaterialCreateModel());
}

function createResult() {
	const newResult = new AnvilResultModel(model);
	console.log(newResult);
	AnvilResultRepository.save(newResult);
	results.value.push(newResult);
	latestResult.value = {model: newResult, selected: false};
	latestResultKey.value++;
	//modelReset();
}

function deleteResult(uuid: string) {
	AnvilResultRepository.delete(uuid);
	results.value = results.value.filter(x => x.uuid !== uuid);
}

function deleteLatestResult() {
	latestResult.value = undefined;
}

function getResults()
{
	const savedResults = AnvilResultRepository.getAll();
	if (savedResults != null)
		results.value = savedResults;
}

function selectResult(uuid: string) {
	displayResults.value.forEach(x => {
		if (x.model.uuid === uuid)
		{
			x.selected = !x.selected;
			return;
		}
		x.selected = false;
	});

	if (latestResult.value?.model.uuid === uuid)
		latestResult.value.selected = !latestResult.value.selected;
	else if (latestResult.value)
		latestResult.value.selected = false;
}

function preloadAllTechniqueImage() {
	Object.values(images).forEach(src => {
		const img = new Image();
		img.src = src;
	});
}

</script>
