<section>
  <h1 class="header">Project timeline</h1>
  <div class="timeline">
    <div class="timeline__item">
      <h1>Intro Call</h1>
      <p>We begin with a fairly short introduction call where we learn about your idea, what you want us to build, and other project parameters.</p>
      <p>Based on this introduction call we will give a cost and time estimate.</p>
    </div>
    <div class="timeline__item">
      <h1>Requirements Gathering</h1>
      <p>In a focus session with you we formulate the list of requirements. Based on these specific requirements we will give the final cost, and time the project will take.</p>
    </div>
    <div class="timeline__item">
      <h1>User Interface</h1>
      <p>If we are tasked with designing the MVP as well, we will begin with the most important screens. We will design these screens in a few styles.</p>
      <p>Based on your feedback we will choose a style for the MVP, and design the rest of the application.</p>
    </div>
    <div class="timeline__item">
      <h1>Development</h1>
      <p>We develop the MVP. We do this in bi-weekly increments, meaning there is an updated application every two weeks. We do this so your feedback can be incorporated often, and quickly.</p>
    </div>
    <div class="timeline__item">
      <h1>Delivery</h1>
      <p>Once the application is fully developed, we help you deploy it to your first users. In this phase we fix unseen bugs and issues.</p>
    </div>
  </div>
</section>

<style>
  section {
    margin: 2rem auto 2rem auto;
  }

  .timeline {
    width: 85%;
    margin: 0 auto 0 auto;
  }

  .timeline__item p {
    font-size: 1.25rem;
    margin: 0.5rem 0 0.5rem 0;
  }

  .timeline__item {
    border-top: 2px solid;
    margin:0; padding: 30px;
    counter-increment: section;
    position: relative;
    border-color: #6b81fa !important;
  }

  .timeline__item:nth-child(even):before {
    content: counter(section);
    right: 100%; 
    margin-right: -20px;
    position: absolute;
    border-radius: 50%;
    padding: 10px;
    height: 20px;
    width: 20px;
    background-image: linear-gradient(111deg, #f85d7f, #6b81fa);
    text-align:center;
    color: white;
    font-size: 110%;
  }

  .timeline__item:nth-child(odd):before {
    content: counter(section);
    left: 100%; 
    margin-left: -20px;
    position: absolute;
    border-radius: 50%;
    padding: 10px;
    height: 20px;
    width: 20px;
    background-image: linear-gradient(111deg, #f85d7f, #6b81fa);
    text-align:center;
    color: white;
    font-size: 110%;
  }

  .timeline__item:nth-child(even) {
    border-left: 2px solid;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    margin-right: 30px;
    padding-right: 0;
  }

  .timeline__item:nth-child(odd) {
    border-right: 2px solid;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    margin-left: 30px; 
    padding-left: 0;
  }

  .timeline__item:first-child {
    border-top: 0;
    border-top-right-radius:0;
    border-top-left-radius:0;
  }

  .timeline__item:last-child {
    border-bottom-right-radius:0;
    border-bottom-left-radius:0;
  }

  /* Tablet */
  @media screen and (min-width: 768px) {
    .timeline {
      width: 50%;
    }
  }

  /* Desktop */
  @media screen and (min-width: 1200px) {
    .timeline {
      width: 40%;
    }
  }
</style>