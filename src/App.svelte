<script>
  import { onMount } from 'svelte';

  let scrollY;

  import WarpSpeed from './warpspeed.min.js';

  let canvas;
  onMount(() => {
    // Add warp effect canvas
    canvas = new WarpSpeed('warpspeed', {"speed":4,"speedAdjFactor":0.03,"density":1.5,"shape":"square","warpEffect":true,"warpEffectLength":7.5,"depthFade":true,"starSize":3,"backgroundColor":"hsl(263,45%,7%)","starColor":"#FFFFFF"})
  })

</script>

<svelte:window bind:scrollY={scrollY}/>
<main>
	<h1 class="title">Pure <i>Speed</i></h1>
  <canvas style="width:100%; height:100%;" id="warpspeed"></canvas>
</main>

<style>
  :global(body) {
		background-color: hsl(263,45%,7%);
    padding: 0;
    margin: 0;
	}

	main {
    width: 100vw;
    height: 100vh;
    text-align: center;
	}

  .title {
    position: absolute;
    color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-size: 72px;
    padding: 16px;
  }
</style>