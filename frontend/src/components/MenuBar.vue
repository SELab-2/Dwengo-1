<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import dwengo_logo from "../../../assets/img/dwengo-groen-zwart.svg";

const route = useRoute();
const teacher = computed(() => route.path.includes("teacher"));
const id = computed(() => route.params.id as string);
</script>

<template>
<main>
  <div class="menu-bar">
    <nav>
      <ul>
        <li class="img_with_text">
          <router-link :to="`/student/${id}/home`">
            <div>
              <img :src="dwengo_logo"/>
              <p class="caption"><span>{{ teacher ? "teacher" : "student" }}</span></p>
            </div>
          </router-link>
        </li>
        <li>
          <router-link v-if="teacher" class="link" :to="`/teacher/${id}/assignment`">assignments</router-link>
          <router-link v-else class="link" :to="`/student/${id}/assignment`">assignments</router-link>
        </li>
        <li>
          <router-link v-if="teacher" class="link" :to="`/teacher/${id}/class`">classes</router-link>
          <router-link v-else class="link" :to="`/student/${id}/class`">classes</router-link>
        </li>
        <li>
          <router-link v-if="teacher" class="link" :to="`/teacher/${id}/discussion`">discussions</router-link>
          <router-link v-else class="link" :to="`/student/${id}/discussion`">discussions</router-link>
        </li>
      </ul>
    </nav>
    <router-view />
    </div>
</main>
</template>

<style scoped>

.menu-bar {
  background: #F6FAF2;
}

nav ul {
  display: flex;
  list-style: none;
  padding: 1%;
  gap: 2%;
}

img {
  max-width: 20%;
  height: auto;
}

.link {
  color: #0E6942;
}

nav a.router-link-active {
  font-weight: bolder;
}

.img_with_text {
    text-align: center;
    display: block;
}

.caption {
  color: black;
  margin-top: -4%;
}


</style>
