<section style="width: 100%; background-color: #000; color: #fff;">
  <section id="why-a-mvp">
    <h1 class="header">Why a MVP?</h1>
    <div class="grid">
      <div class="grid__item">
        <h1>Reduced risk</h1>
        <p>
          Building a full-featured product, only to find out there is no market for it, sucks.
          We focus on building a product with the vital features needed to test your product's main assumptions.
        </p>
      </div>
  
      <div class="grid__item">
        <h1>Reduced cost</h1>
        <p>
          By building a product with only the vital features, not only the risk is reduced, the cost is as well.
          Maintenance costs will also be reduced, less features means less maintentance.
        </p>
      </div>
  
      <div class="grid__item">
        <h1>Time to market</h1>
        <p>We know being first to market can be very important. By building a MVP you will reduce development time, and beat your competitors to market.</p>
      </div>

      <div class="grid__item">
        <h1>Growth</h1>
        <p>A MVP is the easiest way to quickly grow your business. By validating your idea, and getting your first users on board, venture capital will be much easier to obtain.</p>
      </div>
  
    </div>
  </section>
</section>

<style>
  /* Phone styling */
  section {
    padding-top: 1rem;
    margin: 0 auto 0 auto;
    padding: 2rem 0 2rem 0;
  }

  .grid__item h1 {
    font-size: 1.5rem;
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
    .grid {
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
  }

  /* Desktop styling */
  @media screen and (min-width: 1200px) {
    #why-a-mvp {
      width: 40%;
    }
  }

</style>