<script lang="ts">
  import { Filter, Formula, Link, Title, Typeset } from '../Shared'
  import type { Theorem } from '@/models'
  import type { Store } from '@/stores/list'

  export let theorems: Store<Theorem>
</script>

<Filter filter={theorems.filter} />

<table class="table">
  <thead>
    <tr>
      <th style="width: 5%" on:click={theorems.sort('id')}>Id</th>
      <th style="width: 30%">If</th>
      <th style="width: 20%">Then</th>
      <th style="width: 45%">Description</th>
    </tr>
  </thead>
  {#each $theorems as theorem (theorem.id)}
    <tr>
      <td>
        <Link.Theorem {theorem} content="id" />
      </td>
      <td>
        <Formula value={theorem.when} />
      </td>
      <td>
        <Formula value={theorem.then} />
      </td>
      <td>
        <Typeset body={theorem.description} truncated={true} />
      </td>
    </tr>
  {/each}
</table>
