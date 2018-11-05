(function () {

  let limit = 10;
  let offset = 0;

  let opIn = 0.1;
  let opOut = 1;

  let items = [{
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

    attachModalEvents();
    document.getElementById("loadMore").addEventListener("click", function () {
      // update the offset to load the next 10 items
      offset = offset + limit;
      loadItems();
    });
  }

  function attachModalEvents() {
    var modal = document.querySelector(".modal");
    var trigger = document.querySelectorAll(".content-box-thumb");
    var closeButton = document.querySelector(".close-button");

    function toggleModal() {
      modal.classList.toggle("show-modal");
      if (this && this.parentElement) {
        modal.querySelector(".modal-text-preview").innerHTML = this.parentElement.querySelector(".content-box-header").innerHTML;
        modal.querySelector(".modal-image-preview").src = this.src;
      }
    }

    function windowOnClick(event) {
      if (event.target === modal) {
        toggleModal();
      }
    }

    trigger.forEach(function (elem) {
      elem.addEventListener("click", toggleModal);
    });

    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
  }

  function loadItems() {

    let length = (offset + limit < items.length ? offset + limit : items.length);
    for (let i = offset; i < length; i++) {
      let item = items[i];

      let article = `<article class="grid-item content-box">
        <div class="inner">
        <img class="content-box-thumb"src="${item.img}" alt="tech image" />
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

})();