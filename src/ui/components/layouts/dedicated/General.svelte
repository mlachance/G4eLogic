<script>
  import { getContext } from "svelte";

  import AttributeList from "@ui/components/widgets/AttributeList";
  import Pools from "@ui/components/widgets/Pools";
  import EncumbranceTable from "@ui/components/widgets/EncumbranceTable";
  import LiftingTable from "@ui/components/widgets/LiftingTable";
  import PointTotals from "@ui/components/widgets/PointTotals";
  import Combat from "@ui/components/widgets/Combat";

  const { character, components } = getContext("app");
</script>

<style>
  .max-content {
    width: max-content;
  }
  hr {
    @apply border border-solid border-gray-700 m-4 ml-0 mr-0;
  }
</style>

<div class="p-2" />
<div class="flex h-full">
  <div class="p-1" />
  <div>
    <div class="pr-2" />
    <AttributeList />
  </div>
  <div class="p-2" />
  <div>
    <Pools />
    <hr />
    <Combat />
    <hr />
    <div class="m-auto">
      <EncumbranceTable />
    </div>
    <hr />
    <div class="m-auto">
      <LiftingTable />
    </div>
  </div>
  <div class="lg:flex md:ml-4 md:flex-col lg:flex-row flex-1 h-full">
    <div class="order-2">
      <PointTotals />
    </div>
    <hr class="lg:hidden" />
    <div class="flex flex-1">
      <textarea
        rows="25"
        class="lg:mx-4 h-full w-full border-2 border-gray-700 border-solid outline-none" />
    </div>
  </div>
  <div class="lg:hidden p-1" />
</div>
