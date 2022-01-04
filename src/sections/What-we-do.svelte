<section id="what-we-do">
  <div class="grid">
    <div class="grid__item">
      <h1>Building</h1>
      <p>We know being first to market is important. And we know how to build good software. We will turn your idea into a real product, that your users will love.</p>
      <p>We use a modern tech stack, focused on quick development, extendability and security. Building something quickly does not mean we slack on code quality, speed, and security.</p>
    </div>

    <div class="grid__item">
      <h1>Rapid Feedback</h1>
      <p>To make sure we build exactly what you envision, we maintain a constant communication channel. We believe great communication is at the core of every great product. </p>
      <p>We work using Scrum and Agile, in sprints of two weeks, at the end of which we have an improved, and working product.</p>
    </div>

    <div class="grid__item">
      <h1>Delivery</h1>
      <p>Once you are happy with the product, we help you serve it to your first users. If there are big bugs or issues we will of course fix them.</p>
      <p>After this, we provide no more development work. Now it’s your turn to build out your own software team, and to really accelerate the growth of your startup!</p>
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