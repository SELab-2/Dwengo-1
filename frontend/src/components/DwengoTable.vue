<template>
    <v-table class="table">
        <thead>
            <tr v-for="name in columns" :key="column">
                <th class="header">{{ name }}</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="([item1, item2, item3], index) in listItems"
                :key="index"
            >
                <td></td>
                <td>
                    <v-btn
                        :to="`/class/${c.id}`"
                        variant="text"
                    >
                        {{ c.displayName }}
                        <v-icon end> mdi-menu-right </v-icon>
                    </v-btn>
                </td>
                <td>
                    <span v-if="!isMdAndDown">{{ c.id }}</span>
                    <span
                        v-else
                        style="cursor: pointer"
                        @click="openCodeDialog(c.id)"
                        ><v-icon icon="mdi-eye"></v-icon
                    ></span>
                </td>

                <td>{{ c.students.length }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<script>
export default {
  name: 'columnList',
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>