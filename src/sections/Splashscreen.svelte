<section>
  <div class="splashscreen_content">
    <div class="splashscreen_content_image">
      <img src="/img/img-14.png" alt="">
    </div>
    <div class="splashscreen_content_headings">
      <h1 class="title">We bring your startup to life</h1>
      <h2 class="subtitle"><span style="background-image: linear-gradient(111deg, #f85d7f, #6b81fa);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;">Launch fast</span> with a solid minimum viable product</h2>
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
    width: 75%;
    overflow: hidden;
    margin: 5vh auto 0 auto;
  }

  .splashscreen_content_image img {
    width: 100%;
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
      width: 70%;
    }

    .splashscreen_content_image {
      float: right;
      width: 30%;
      margin: 40vh 0 0 0;
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
    
    .splashscreen_content_image {
      margin: 25vh 0 0 0;
    }

    .title {
      font-size: 64px;
    }

    .subtitle {
      font-size: 32px;
    }
  }
</style>