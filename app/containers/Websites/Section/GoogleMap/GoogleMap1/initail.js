export default {
  name: 'GoogleMap',
  design: 'GoogleMap1',
  fluid: true,
  data: {
    title: '<h2 style="text-align: center;">MAP SECTION</h2>',
    clientContent: `
      <div class="preview-content-map">
        <div class="blog">
          <div class="preview-img"><img src="http://i267.photobucket.com/albums/ii313/akon3000/default_zpsnuk4jbza.png" /></div>
          <h2>This is the title your</h2>
          <p>Let us show</p>
          <p>At the content</p>
        </div>
        <div class="blog">
          <div class="preview-img"><img src="http://i267.photobucket.com/albums/ii313/akon3000/default_zpsnuk4jbza.png" /></div>
          <h2>This is the title your</h2>
          <p>Let us show</p>
          <p>At the content</p>
        </div>
        <div class="blog">
          <div class="preview-img"><img src="http://i267.photobucket.com/albums/ii313/akon3000/default_zpsnuk4jbza.png" /></div>
          <h2>This is the title your</h2>
          <p>Let us show</p>
          <p>At the content</p>
        </div>
      </div>
      
      <style><!--
        .preview-content-map {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        }

        .preview-content-map .blog {
          width: 33.33%;
          text-align: center;
        }

        .preview-content-map .blog .preview-img {
          width: 150px;
          height: 150px;
          display: inline-block;
          background-color: #F8F8F8;
          border-radius: 50%;
          position: relative;
        }

        .preview-content-map .blog .preview-img > img {
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @media only screen and (max-width: 960px) {
          .preview-content-map .blog {
            width: 50%;
          }
        }

        @media only screen and (max-width: 610px) {
          .preview-content-map .blog {
            width: 100%;
          }
        }
      --></style>
    `,
  },
  setting: {
    title: true,
    clientContent: true,
    mapSize: {
      width: 100,
      height: 500,
    },
  },
};
