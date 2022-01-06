<section>
  <div class="splashscreen_content">
    <div class="splashscreen_content_image">
      <img src="/img/rocket-launch.png" alt="">
      <!-- <img src="/img/rocket.png" alt=""> -->
    </div>
    <div class="splashscreen_content_headings">
      <h1 class="title">We bring your startup to life</h1>
      <h2 class="subtitle"><span class="gradient-text">Launch fast</span> with a minimum viable product your <span class="gradient-text">users will love</span></h2>
      <a href="#what-we-do" class="button" style="margin-top: 2rem;">Schedule a call <span style="display: inline-block; transform: rotate(-45deg); margin-left: 0.5rem;">&#10132;</span></a>
    </div>
  </div>
</section>

<style>
  /* Phone styling */
  section {
    height: 85vh;
    margin: 8rem auto 0 auto;
  }

  .splashscreen_content {
    display: flex;
    flex-wrap: wrap;
    row-gap: 4rem;
  }

  .splashscreen_content_image img {
    display: block;
    width: 25%;
    margin: 0 auto 0 auto;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 20px;
    font-weight: 500;
    padding: 8px 0 0 0;
  }

  /* Tablet and laptop styling */
  @media screen and (min-width: 768px) {
    section {
      height: 95vh;
      margin: 0 auto 0 auto;
    }

    .splashscreen_content {
      height: 100%;
      width: 100%;
      margin: 0 auto 0 auto;
      flex-wrap: nowrap;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
    }
    
    .splashscreen_content_image {
      width: 50%;
    }

    .splashscreen_content_image img {
      margin: 0 auto 0 auto;
      width: 40%;
    }

    .title {
      font-size: 48px;
    }

    .subtitle {
      font-size: 24px;
    }
  }

  /* Desktop styling */
  @media screen and (min-width: 1200px) {
    .splashscreen_content {
      gap: 10%;
    }

    .splashscreen_content_headings {
      width: 60%;
    }

    .splashscreen_content_image {
      width: 30%;
    }

    .splashscreen_content_image img {
      width: 55%;
    }

    .title {
      font-size: 64px;
    }

    .subtitle {
      font-size: 32px;
    }
  }
</style>