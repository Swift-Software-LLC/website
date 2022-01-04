<section>
  <div class="splashscreen_content">
    <div class="splashscreen_content_image">
      <img src="/img/rocket.png" alt="">
    </div>
    <div class="splashscreen_content_headings">
      <h1 class="title">We bring your startup to life</h1>
      <h2 class="subtitle"><span class="gradient-text">Launch fast</span> with an <span class="gradient-text">amazing</span> minimum viable product</h2>
      <a href="#what-we-do" class="button" style="margin-top: 2rem;">Find out what we do <span style="display: inline-block; transform: rotate(90deg); margin-left: 0.5rem;">&#10132;</span></a>
    </div>
  </div>
</section>

<style>
  /* Phone styling */
  section {
    width: 90vw;
    height: 90vh;
    margin: 0 auto 0 auto;
  }

  .splashscreen_content_headings {
    padding: 5vh 0 0 0;
    width: 100%;
  }

  .splashscreen_content_image {
    width: 100%;
    overflow: hidden;
    margin: 5vh auto 5vh auto;
  }

  .splashscreen_content_image img {
    display: block;
    width: 20%;
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
      width: 90vw;
      height: 95vh;
    }

    .splashscreen_content_headings {
      padding: 40vh 0 0 0;
      float: left;
      width: 60%;
    }

    .splashscreen_content_image {
      float: right;
      width: 40%;
      margin: 40vh auto 0 auto;
    }

    .splashscreen_content_image img {
      width: 25%;
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
    section {
      width: 70vw;
    }

    .splashscreen_content_headings {
      width: 70%;
    }
    
    .splashscreen_content_image {
      margin: 20% auto 0 auto;
      width: 30%;
    }

    .splashscreen_content_image img {
      width: 50%;
    }

    .title {
      font-size: 64px;
    }

    .subtitle {
      font-size: 32px;
    }
  }
</style>