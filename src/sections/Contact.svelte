<section style="width: 100%; background-color: #000; color: #fff;">
  <section id="contact-us" style="text-align: center;">
    <h1 class="header">Contact us</h1>
    <a href="" class="button" style="background-color: #fff; color: #000; text-align: center; margin: 0 auto 2rem auto;" onclick={"Calendly.initPopupWidget({url: 'https://calendly.com/swiftsoftware/introduction-call'});return false;"}>Schedule a call <span style="display: inline-block; transform: rotate(-45deg); margin-left: 0.5rem;">&#10132;</span></a>
    <div id="contact-details">
      <div id="contact-details__item">
        <p>Email:</p>
        <p><a href="mailto:contact@swiftsoftware.nl">contact@swiftsoftware.nl</a></p>
      </div>
      <div id="contact-details__item">
        <p>Phone:</p>
        <p>(+31) 637290533</p>
      </div>
      <div id="contact-details__item">
        <p>KVK:</p>
        <p>81934580</p>
      </div>
    </div>
  </section>
</section>

<style>
  section {
    padding-top: 1rem;
    margin: 0 auto 0 auto;
    padding: 2rem 0 2rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0.5rem 0 0.5rem 0;
  }

  #contact-details__item {
    display: flex;
    justify-content: space-between;
  }

  #contact-details__item p:nth-child(2) {
    text-align: right;
  }

  /* Tablet and laptop styling */
  @media screen and (min-width: 768px) {
    #contact-us {
      width: 40%;
      margin: 0 auto 0 auto;
    }
  }

  /* Desktop styling */
  @media screen and (min-width: 1200px) {
    #contact-us {
      width: 20%;
    }
  }
</style>