  let limit = 10;
  let offset = 0;

  let opIn = 0.1;
  let opOut = 1;

  let items = [{
    img: 'https://dmm8trq3la0u4.cloudfront.net/wp-content/uploads/2018/04/youtube-832x350.jpg',
    title: 'Fireworks on the 4th',
    isYoutube: true,
    embedId: "bTqVqk7FSmY"
  }, {
    img: 'https://asda.scene7.com/is/image/Asda/0811571016525?hei=532&wid=910&qlt=85&fmt=pjpg&resmode=sharp&op_usm=1.1,0.5,0,0&defaultimage=default_details_George_rd',
    title: 'Introducing Chromecast',
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Sunrise',
    videoUrl: "https://s3.us-east-2.amazonaws.com/drift-timelapse/Sunrise.mp4"
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Fireworks on the 4th'
  }, ];


  let videoEl = document.querySelector('.dynamic-grid.video-holder');

  // load if exist- only home page
  if (videoEl) {
    loadItems();

    //attachModalEvents();
    document.getElementById("loadMore").addEventListener("click", function () {
      // update the offset to load the next 10 items
      offset = offset + limit;
      loadItems();
    });
  }

  //function attachModalEvents() {
  var modal = document.querySelector(".modal");
  var closeButton = document.querySelector(".close-button");
  let wrapper = document.getElementById("modal-content-wrapper");
  let modalHTML = wrapper.innerHTML; // Save HTML before making

  function toggleModal(ref) {
    if (ref && ref.parentElement) {

      // Update modal HTML is its a youtube video
      if (ref.hasAttribute("data-youtube") && ref.getAttribute("data-youtube") != 'undefined') {
        modalYTRef = document.getElementById("youtubeVideoPlayerArea");
        modalYTRef.style.display = "block";
        modalYTRef.setAttribute("data-plyr-provider", "youtube");
        modalYTRef.setAttribute("data-plyr-embed-id", ref.getAttribute("data-embed"));
        initializeVideo("#youtubeVideoPlayerArea");

      } else {
        modalVideoRef = document.getElementById("normalVideoPlayerArea");
        modalVideoRef.poster = ref.src;
        source = document.getElementById("normal-video-player-area-source");
        source.src = ref.getAttribute("data-videoUrl");
        modalVideoRef.style.display = "block";
        initializeVideo("#normalVideoPlayerArea");
      }

      document.getElementById("video-title").innerHTML = ref.parentElement.querySelector(".content-box-header").innerHTML;
      modal.classList.toggle("show-modal");
    }
  }

  function windowOnClick(event) {
    if (event.target === modal) {
      toggleModal();
    }
  }

  // Click handler on close button of modal
  closeButton.addEventListener("click", function () {
    modal.classList.toggle("show-modal")
    resetModal(wrapper);
  });

  window.addEventListener("click", windowOnClick);

  // Reset modal HTML on video close
  function resetModal(element) {
    element.innerHTML = "";
    element.innerHTML = modalHTML;
  }

  // Scroll to make subscription view
  document.querySelector(".mobile-app-badge-link").addEventListener("click", function () {
    document.querySelector('.mailjet-subscription').scrollIntoView({
      behavior: 'smooth'
    });
  })


  // Load video cards with HTML
  function loadItems() {

    let length = (offset + limit < items.length ? offset + limit : items.length);
    for (let i = offset; i < length; i++) {
      let item = items[i];

      let article = `<article class="grid-item content-box">
        <div class="inner">
        <img width="450" onclick="toggleModal(this)" data-videoUrl="${item.videoUrl}" class="content-box-thumb"src="${item.img}" alt="tech image"  data-youtube="${item.isYoutube}"
        data-embed="${item.isYoutube ? item.embedId : ''}"/>
        <h1 class="content-box-header">
          ${item.title + " - "+ i}
        </h1>
        </div>
      </article>`;

      videoEl.innerHTML += article;
    }

    if (length === items.length) {
      document.getElementById("loadMore").style.display = "none";
    }

    setTimeout(function () {
      let placeholder = document.querySelector(".video-placeholder");
      let holder = document.querySelector(".video-holder");

      timerIn = setInterval(function () {
        fadeIn(holder)
      }, 100)
      timerOut = setInterval(function () {
        fadeOut(placeholder)
      }, 100)
    }, 500);


    function fadeIn(element) {
      if (opIn >= 0.95) {
        clearInterval(timerIn);
        element.style.visibility = "visible";
      }
      element.style.opacity = opIn;
      opIn += opIn * 0.1;

    }

    function fadeOut(element) {
      if (opOut <= 0.1) {
        clearInterval(timerOut);
        element.style.display = "none";
      }
      element.style.opacity = opOut;
      opOut -= opOut * 0.1;

    }

  }

  function initializeVideo(id) {
    const player = new Plyr(id, {});
    window.player = player;
  }