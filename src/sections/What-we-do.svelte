<section id="what-we-do">
  <!-- <div class="bulletpoints">
    <div class="bulletpoints__item">
      <div class="flex-container">
        <div>
          <h1>Building</h1>
          <p>We use a modern tech stack to build your MVP as quickly as possible. We know that being first to market can be life or death for a startup.</p>
          <p>We build quickly and efficiently. Without making compromises to expandability and security.</p>
        </div>
        <img src="/img/tools (angle).png" alt="">
      </div>
    </div>

    <div class="bulletpoints__item">
      <div class="flex-container">
        <img src="/img/bubble.png" alt="">
        <div>
          <h1>Rapid Feedback</h1>
          <p>We constantly communicate with you to make sure the product is just as you want. We have weekly meetings discussing the progress that has been made.</p>
        </div>
      </div>
    </div>
  </div> -->

  <div class="grid">
    <div class="grid__item">
      <h1>Building</h1>
      <p>We use a modern tech stack to build your MVP as quickly as possible. We know that being first to market can be life or death for a startup.</p>
      <p>We build quickly and efficiently. Without making compromises to expandability and security.</p>
    </div>

    <div class="grid__item">
      <h1>Rapid Feedback</h1>
      <p>We constantly communicate with you to make sure the product is just as you want. We have weekly meetings discussing the progress that has been made.</p>
    </div>

    <div class="grid__item">
      <h1>Test</h1>
      <p>Test</p>
    </div>

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

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1.25rem;
    margin: 1rem 0 1rem 0;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  /* Tablet and laptop styling */
  @media screen and (min-width: 768px) {
    section {
      width: 90vw;
    }

    .grid {
      grid-template-columns: 1fr 1fr;
      column-gap: 1rem;
    }
  }

  /* Desktop styling */
  @media screen and (min-width: 1200px) {
    section {
      width: 60vw;
    }

    .grid {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

</style>