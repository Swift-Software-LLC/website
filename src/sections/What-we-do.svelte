<section id="what-we-do">
  <div class="grid">
    <div class="card">
      <img src="" alt="">
      <h1>Build your MVP</h1>
    </div>
    <div class="card">
      <img src="" alt="">
      <h1>Rapid Feedback Loops</h1>
    </div>
    <div class="card">
      <img src="" alt="">
      <h1>Fast Communication</h1>
    </div>
    <img src="" alt="">
    <div class="card card__wide"></div>
  </div>
</section>

<style>
  /* Phone styling */
  section {
    width: 90vw;
    height: 100vh;
    padding-top: 1rem;
    margin: 0 auto 0 auto;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 1rem;
  }

  .card {
    width: auto;
    height: 35vh;
    background-color: #F1F1F1;
    border-radius: 1rem;
    text-align: center;
  }

  .card > h1 {
    font-size: 2rem;
    padding: 2rem;

    background-image: linear-gradient(111deg, #f85d7f, #6b81fa);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
  }

  /* Tablet and laptop styling */
  @media screen and (min-width: 768px) {
    section {
      width: 90vw;
    }

    .grid {
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: 1rem;
    }

    .card__wide {
      grid-row-start: span 1;
      grid-row-end: span 1;
      grid-column-start: span 3;
      grid-column-end: span 3;
    }
  }

  /* Desktop styling */
  @media screen and (min-width: 1200px) {
    section {
      width: 70vw;
    }

    .card {
      height: 50vh;
    }
  }

</style>