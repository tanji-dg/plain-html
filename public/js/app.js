  let limit = 10;
  let offset = 0;

  let opIn = 0.1;
  let opOut = 1;

  var driftLibrary = window.driftLibrary || {};

  let videoEl = document.querySelector('.dynamic-grid.video-holder');
  let modal = document.querySelector(".modal");
  var closeButton = document.querySelector(".close-button");
  let wrapper = document.getElementById("modal-content-wrapper");
  let modalHTML = wrapper.innerHTML; // Save HTML before making
  let loadMoreEl = document.getElementById("loadMore");
  let searchBarEl = document.getElementById("search-bar");
  let searchIconEl = document.getElementById("search-bar-icon");
  let searchNoResult = document.getElementById("search-no-result");
  let currentDataset = [],
    searchDataset = [],
    isSearchData = false;

  driftLibrary.helpers = {
    toggleModal: function (ref) {
      if (ref && ref.parentElement) {
        // Update modal HTML is its a youtube video
        if (ref.hasAttribute("data-youtube") && ref.getAttribute("data-youtube") != 'undefined') {
          modalYTRef = document.getElementById("youtubeVideoPlayerArea");
          modalYTRef.style.display = "block";
          modalYTRef.setAttribute("data-plyr-provider", "youtube");
          modalYTRef.setAttribute("data-plyr-embed-id", ref.getAttribute("data-embed"));
          driftLibrary.helpers.initializeVideo("#youtubeVideoPlayerArea");

        } else {
          modalVideoRef = document.getElementById("normalVideoPlayerArea");
          modalVideoRef.poster = ref.src;
          source = document.getElementById("normal-video-player-area-source");
          source.src = ref.getAttribute("data-videoUrl");
          modalVideoRef.style.display = "block";
          driftLibrary.helpers.initializeVideo("#normalVideoPlayerArea");
        }

        document.getElementById("video-title").innerHTML = ref.parentElement.querySelector(".content-box-header").innerHTML;
        modal.classList.toggle("show-modal");
      }

    },
    loadItems: function (items) {
      let length = (offset + limit < items.length ? offset + limit : items.length);
      for (let i = offset; i < length; i++) {
        let item = items[i];

        let article = `<article class="grid-item content-box">
        <div class="inner">
        <img width="450" onclick=" driftLibrary.helpers.toggleModal(this)" data-videoUrl="${item.videoUrl}" class="content-box-thumb"src="${item.img}" alt="tech image"  data-youtube="${item.isYoutube}"
        data-embed="${item.isYoutube ? item.embedId : ''}"/>
        <h1 class="content-box-header">
          ${item.title + " - "+ i}
        </h1>
        </div>
      </article>`;

        videoEl.innerHTML += article;
        if (length === items.length) {
          loadMoreEl.style.display = "none";
        }
      }

    },
    initializeView: function () {
      setTimeout(function () {
        let placeholder = document.querySelector(".video-placeholder");
        let holder = document.querySelector(".video-holder");

        timerIn = setInterval(function () {
          driftLibrary.helpers.fadeIn(holder)
        }, 100)
        timerOut = setInterval(function () {
          driftLibrary.helpers.fadeOut(placeholder)
        }, 100)
      }, 300);

    },

    initializeVideo: function (id) {
      const player = new Plyr(id, {});
      window.player = player;
    },
    // Reset modal HTML on video close
    resetModal: function (element) {
      element.innerHTML = "";
      element.innerHTML = modalHTML;
    },

    fadeIn: function (element) {
      if (opIn >= 0.95) {
        clearInterval(timerIn);
        element.style.visibility = "visible";
      }
      element.style.opacity = opIn;
      opIn += opIn * 0.1;

    },

    fadeOut: function (element) {
      if (opOut <= 0.1) {
        clearInterval(timerOut);
        element.style.display = "none";
      }
      element.style.opacity = opOut;
      opOut -= opOut * 0.1;

    },
    modalCloseEvent: function (event) {
      if (event.target === modal) {
        driftLibrary.helpers.toggleModal();
      }
    },
    initializeEventHandlers: function () {
      var self = this;
      loadMoreEl.addEventListener("click", function () {
        // update the offset to load the next 10 items
        offset = offset + limit;
        driftLibrary.helpers.loadItems(currentDataset);

      });

      // Click handler on close button of modal
      closeButton.addEventListener("click", function () {
        modal.classList.toggle("show-modal");
        driftLibrary.helpers.resetModal(wrapper);

      });

      window.addEventListener("click", this.modalCloseEvent);

      // Scroll to make subscription view
      document.querySelector(".mobile-app-badge-link").addEventListener("click", function () {
        document.querySelector('.mailjet-subscription').scrollIntoView({
          behavior: 'smooth'
        });

      });

      //search event handlers 
      searchIconEl.addEventListener("click", function (e) {

        if (isSearchData) {
          isSearchData = false;
          currentDataset = driftLibrary.allDataItems;
          self.clearAllItems();
          self.searchViewUpdate(searchIconEl, "icon");
          self.loadItems(currentDataset);

        } else {
          isSearchData = true;
          self.searchViewUpdate(searchIconEl, "clear");
          self.dataSearch(searchBarEl.value);

        }

      });

      searchBarEl.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {

          e.preventDefault();
          self.searchViewUpdate(searchIconEl, "clear");
          isSearchData = true;
          // code for enter
          self.dataSearch(searchBarEl.value);
        }

      });

    },

    dataSearch: function (searchText) {
      
      searchDataset = [];
      var data = driftLibrary.allDataItems;
      for (var i = 0; i < data.length; i++) {
        if (this.searchTextMatch(data[i], searchText)) {
          searchDataset.push(data[i]);
        }

      }

      if (searchDataset.length > 0) {
        searchNoResult.style.display="none";
        currentDataset = searchDataset;
        this.clearAllItems();
        this.loadItems(currentDataset);

      } else {
        searchNoResult.style.display="block"
      }
    },

    searchViewUpdate: function (element, state) {
      element.src = state == "clear" ? "./assets/search-clear.png" : "./assets/search-icon.png";
      searchNoResult.style.display="none";

    },

    searchTextMatch: function (data, searchText) {
      if ((data.title && data.title.toLowerCase().indexOf(searchText) != -1) ||
        (data.description && data.description.toLowerCase().indexOf(searchText) != -1)) {
        return true
      }
      return false;

    },

    clearAllItems: function () {
      document.getElementsByClassName("video-holder")[0].innerHTML = "";

    }
  };

  /*Each video item will have
  title, poster, video link (s3 or youtube), isYoutube (if youtube), embedId (if youtube)
  owner name, owner work profile
  */
  driftLibrary.allDataItems = [{
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
    title: 'Clouds Moving',
    videoUrl: 'https://s3.us-east-2.amazonaws.com/drift-timelapse/Clouds+Moving.mp4'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Clouds',
    videoUrl: 'https://s3.us-east-2.amazonaws.com/drift-timelapse/Clouds.mp4'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Cold Winter Day',
    videoUrl: 'https://s3.us-east-2.amazonaws.com/drift-timelapse/Cloud+Winter+Day.mp4'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Mountains',
    videoUrl: 'https://s3.us-east-2.amazonaws.com/drift-timelapse/Mountain.mp4'
  }, {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6234/unsplashed2-photo-1414912925664-0c502cc25dde.jpeg',
    title: 'Night Sky',
    videoUrl: 'https://s3.us-east-2.amazonaws.com/drift-timelapse/Night+Sky.mp4'
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

  // load if exist- only home page
  if (videoEl) {
    currentDataset = driftLibrary.allDataItems;
    driftLibrary.helpers.loadItems(currentDataset);
    driftLibrary.helpers.initializeView();
    driftLibrary.helpers.initializeEventHandlers();
  }