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
  let bodyEl = document.getElementsByTagName("body")[0];
  let currentDataset = [],
    searchDataset = [],
    isSearchData = false;

  driftLibrary.helpers = {
    toggleModal: function (ref) {
      if (ref && ref.parentElement) {
        // Update modal HTML is its a youtube video
        if (ref.hasAttribute("data-youtube") && (ref.getAttribute("data-youtube") != 'undefined' &&
            ref.getAttribute("data-youtube") != "false")) {
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

        bodyEl.classList.toggle("body-overflow-hidden");
      }

    },
    loadItems: function (items) {
      let length = (offset + limit < items.length ? offset + limit : items.length);
      for (let i = offset; i < length; i++) {
        let item = items[i];

        let article = `<article class="grid-item content-box">
        <div class="inner">
        <img width="450" onclick=" driftLibrary.helpers.toggleModal(this)" 
        data-videoUrl="${item.videoUrl}" class="content-box-thumb" src="${item.poster}" 
        alt="${item.title}" title="${item.title}"  data-youtube="${item.isYoutube}"
        data-embed="${item.isYoutube ? item.embedId : ''}"/>
        <h1 class="content-box-header">
          ${item.title}
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
        bodyEl.classList.toggle("body-overflow-hidden");
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
        searchNoResult.style.display = "none";
        currentDataset = searchDataset;
        this.clearAllItems();
        this.loadItems(currentDataset);

      } else {
        searchNoResult.style.display = "block"
      }
    },

    searchViewUpdate: function (element, state) {
      element.src = state == "clear" ? "./assets/search-clear.png" : "./assets/search-icon.png";
      searchNoResult.style.display = "none";

    },

    searchTextMatch: function (data, searchText) {
      if ((data.title && data.title.toLowerCase().indexOf(searchText.toLowerCase()) != -1) ||
        (data.description && data.description.toLowerCase().indexOf(searchText.toLowerCase()) != -1)) {
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
    "title": "Clouds Blue Sky Sky Nature Day",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/clouds-blue-sky-sky-nature-day-9825.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/clouds-blue-sky-sky-nature-day-9825.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cloud Time Lapse Sky Clouds Blue",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/cloud-time-lapse-sky-clouds-blue-2142.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/cloud-time-lapse-sky-clouds-blue-2142.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "River Ship Evening Romantic",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/river-ship-evening-romantic-6815.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/river-ship-evening-romantic-6815.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Car Road Transportation Vehicle",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/car-road-transportation-vehicle-2165.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/car-road-transportation-vehicle-2165.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Lights Houses Streets Sissach",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/lights-houses-streets-sissach-13441.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/lights-houses-streets-sissach-13441.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Train Rail Weather Railroad",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/train-rail-weather-railroad-2213.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/train-rail-weather-railroad-2213.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Full Moon Moon Night Hyper Lapse",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/full-moon-moon-night-hyper-lapse-2144.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/full-moon-moon-night-hyper-lapse-2144.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Sunset Winter Snow",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-sunset-winter-snow-6975.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-sunset-winter-snow-6975.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clock Camera Quick Passage Of Time",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/clock-camera-quick-passage-of-time-3019.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/clock-camera-quick-passage-of-time-3019.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Clouds Landscape",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-clouds-landscape-7001.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-clouds-landscape-7001.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunrise Morning Sun Morgenstimmung",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sunrise-morning-sun-morgenstimmung-12671.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sunrise-morning-sun-morgenstimmung-12671.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Car Traffic Road Travel City",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/car-traffic-road-travel-city-5715.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/car-traffic-road-travel-city-5715.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Mountains Clouds Nature Landscape",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/mountains-clouds-nature-landscape-4406.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/mountains-clouds-nature-landscape-4406.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Flowers Nature Time Blossom Leaf",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/flowers-nature-time-blossom-leaf-7924.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/flowers-nature-time-blossom-leaf-7924.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Tree Cloudy Sky Sky Clouds",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/clouds-tree-cloudy-sky-sky-clouds-2149.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/clouds-tree-cloudy-sky-sky-clouds-2149.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Electricity Wires Time Lapse Sunset",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/electricity-wires-time-lapse-sunset-2151.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/electricity-wires-time-lapse-sunset-2151.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunset Time Lapse Clouds Mood Sky",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sunset-time-lapse-clouds-mood-sky-9783.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sunset-time-lapse-clouds-mood-sky-9783.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Sun Clouds Sky Sunset",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-sun-clouds-sky-sunset-12767.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-sun-clouds-sky-sunset-12767.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Subway Seoul Tunnel Travel Drive",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/subway-seoul-tunnel-travel-drive-14037.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/subway-seoul-tunnel-travel-drive-14037.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Shopping Pedestrian Time Lapse City",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/shopping-pedestrian-time-lapse-city-2121.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/shopping-pedestrian-time-lapse-city-2121.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Weather Cloudiness Sky Forward",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/weather-cloudiness-sky-forward-11057.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/weather-cloudiness-sky-forward-11057.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Flower Sky Clouds Processing",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/flower-sky-clouds-processing-4072.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/flower-sky-clouds-processing-4072.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Lake Blue Sky Scenic Clouds",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/lake-blue-sky-scenic-clouds-2422.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/lake-blue-sky-scenic-clouds-2422.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "White Clouds Blue Sky Summer",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/white-clouds-blue-sky-summer-2093.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/white-clouds-blue-sky-summer-2093.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Morgenrot Sunrise Clouds Sky Mood",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/morgenrot-sunrise-clouds-sky-mood-12766.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/morgenrot-sunrise-clouds-sky-mood-12766.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Mountains Austria Time Lapse Hiking",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/mountains-austria-time-lapse-hiking-1805.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/mountains-austria-time-lapse-hiking-1805.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Highway Traffic Lights Vehicles",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/highway-traffic-lights-vehicles-12769.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/highway-traffic-lights-vehicles-12769.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Supermarket Cart Market Mall Buy",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/supermarket-cart-market-mall-buy-1735.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/supermarket-cart-market-mall-buy-1735.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Bern Switzerland Rose Garden",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/bern-switzerland-rose-garden-7033.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/bern-switzerland-rose-garden-7033.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Astrology Astronomy Astrophotography",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/astrology-astronomy-astrophotography-2528.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/astrology-astronomy-astrophotography-2528.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Waterfall Cascade Forest Fall",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/waterfall-cascade-forest-fall-1702.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/waterfall-cascade-forest-fall-1702.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Car Road Auto Transportation",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/car-road-auto-transportation-1906.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/car-road-auto-transportation-1906.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Lake Water Landscape Scenery",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/lake-water-landscape-scenery-1905.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/lake-water-landscape-scenery-1905.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Watzmann Time Lapse Mountains",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/watzmann-time-lapse-mountains-12792.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/watzmann-time-lapse-mountains-12792.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Landscape Lake Clouds Nature Sky",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/landscape-lake-clouds-nature-sky-2900.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/landscape-lake-clouds-nature-sky-2900.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Dubrovnik Sunset Sea City",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/dubrovnik-sunset-sea-city-12866.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/dubrovnik-sunset-sea-city-12866.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunset Beach North Sea Sand Beach",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sunset-beach-north-sea-sand-beach-1757.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sunset-beach-north-sea-sand-beach-1757.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Thunderstorm Storm Time Lapse",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/thunderstorm-storm-time-lapse-9451.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/thunderstorm-storm-time-lapse-9451.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "La Crusc Church Monastery Refuge",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/la-crusc-church-monastery-refuge-4993.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/la-crusc-church-monastery-refuge-4993.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Highway Rain Auto Storm Fast",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/highway-rain-auto-storm-fast-3277.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/highway-rain-auto-storm-fast-3277.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Weather Atmosphere Time Sky",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/clouds-weather-atmosphere-time-sky-695.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/clouds-weather-atmosphere-time-sky-695.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Timelaps Monastery Ruin",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-timelaps-monastery-ruin-2876.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-timelaps-monastery-ruin-2876.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Clouds Blue Sky Nature",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-clouds-blue-sky-nature-12660.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-clouds-blue-sky-nature-12660.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "River Tyne River Bridge Time Lapse",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/river-tyne-river-bridge-time-lapse-1400.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/river-tyne-river-bridge-time-lapse-1400.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Timelapse Sky Nature",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/clouds-timelapse-sky-nature-8884.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/clouds-timelapse-sky-nature-8884.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Origami Paper Bend Plane Isolated",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/origami-paper-bend-plane-isolated-9081.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/origami-paper-bend-plane-isolated-9081.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Easter Bright Burn Burning Candle",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/easter-bright-burn-burning-candle-2531.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/easter-bright-burn-burning-candle-2531.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Bright Burn Burning Candle",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/bright-burn-burning-candle-2530.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/bright-burn-burning-candle-2530.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Clouds Sky Atmosphere",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-clouds-sky-atmosphere-9041.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-clouds-sky-atmosphere-9041.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "North Sea Time Lapse Sea",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/north-sea-time-lapse-sea-11220.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/north-sea-time-lapse-sea-11220.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Night Lapse Night Time Nature Sky",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/night-lapse-night-time-nature-sky-1341.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/night-lapse-night-time-nature-sky-1341.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Beach Coast Sea Time Lapse Usedom",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/beach-coast-sea-time-lapse-usedom-3894.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/beach-coast-sea-time-lapse-usedom-3894.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Timelapse Sky Nature",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/clouds-timelapse-sky-nature-8883.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/clouds-timelapse-sky-nature-8883.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Nature Landscape Time Lapse Video",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/nature-landscape-time-lapse-video-18586.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/nature-landscape-time-lapse-video-18586.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cowichan Vancouver Island Canada",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/cowichan-vancouver-island-canada-16380.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/cowichan-vancouver-island-canada-16380.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Full Moon Fog Sky",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-full-moon-fog-sky-7014.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-full-moon-fog-sky-7014.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sky Rays Time Lapse Clouds Sun",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sky-rays-time-lapse-clouds-sun-5151.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sky-rays-time-lapse-clouds-sun-5151.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Star Long Exposure Time Lapse",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/star-long-exposure-time-lapse-8097.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/star-long-exposure-time-lapse-8097.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sun Clouds Time Lapse Light Lake",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sun-clouds-time-lapse-light-lake-6343.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sun-clouds-time-lapse-light-lake-6343.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cable Car London Motion",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/cable-car-london-motion-3603.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/cable-car-london-motion-3603.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Church Clock Tower Architecture",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/church-clock-tower-architecture-3696.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/church-clock-tower-architecture-3696.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Sunset Sky Landscape",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/clouds-sunset-sky-landscape-5932.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/clouds-sunset-sky-landscape-5932.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "G%c3%a4ggersteg Hyperlapse Nature",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/g%C3%A4ggersteg-hyperlapse-nature-9651.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/g%C3%A4ggersteg-hyperlapse-nature-9651.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Night Barcelona City Bus Station",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/night-barcelona-city-bus-station-4371.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/night-barcelona-city-bus-station-4371.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Lake Blue Sky Scenic Clouds",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/lake-blue-sky-scenic-clouds-2424.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/lake-blue-sky-scenic-clouds-2424.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Berlin City Tv Tower Time Lapse",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/berlin-city-tv-tower-time-lapse-10165.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/berlin-city-tv-tower-time-lapse-10165.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunset Sea Landscape Sky Coast",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sunset-sea-landscape-sky-coast-8653.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sunset-sea-landscape-sky-coast-8653.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Water Boat Time Lapse Yacht Sea",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/water-boat-time-lapse-yacht-sea-1907.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/water-boat-time-lapse-yacht-sea-1907.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Junction Time Lapse Traffic Autos",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/junction-time-lapse-traffic-autos-10103.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/junction-time-lapse-traffic-autos-10103.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sushi Doing Dinner Meal",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sushi-doing-dinner-meal-5692.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sushi-doing-dinner-meal-5692.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Timelapse Port Time Lapse",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/timelapse-port-time-lapse-10909.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/timelapse-port-time-lapse-10909.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Timelapse Port Time Lapse",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/timelapse-port-time-lapse-10910.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/timelapse-port-time-lapse-10910.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Strommast Clouds Sky Power Poles",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/strommast-clouds-sky-power-poles-10749.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/strommast-clouds-sky-power-poles-10749.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sky Cloud Time Lapse Blue Weather",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sky-cloud-time-lapse-blue-weather-19050.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sky-cloud-time-lapse-blue-weather-19050.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sushi Doing Dinner Meal",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sushi-doing-dinner-meal-5693.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sushi-doing-dinner-meal-5693.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sky Outdoor Nature Cloud Beautiful",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sky-outdoor-nature-cloud-beautiful-18919.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sky-outdoor-nature-cloud-beautiful-18919.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Sky Time Lapse Summer Blue",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/clouds-sky-time-lapse-summer-blue-8717.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/clouds-sky-time-lapse-summer-blue-8717.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Mexico City Time Lapse Mexico",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/mexico-city-time-lapse-mexico-10527.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/mexico-city-time-lapse-mexico-10527.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Himalaya Annapurna Sunrise Nepal",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/himalaya-annapurna-sunrise-nepal-14323.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/himalaya-annapurna-sunrise-nepal-14323.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Highway Autos Traffic Vehicles",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/highway-autos-traffic-vehicles-9117.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/highway-autos-traffic-vehicles-9117.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Cologne Dom Rhine River",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-cologne-dom-rhine-river-8820.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-cologne-dom-rhine-river-8820.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Karlsruhe Clouds Time Lapse Sunset",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/karlsruhe-clouds-time-lapse-sunset-4694.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/karlsruhe-clouds-time-lapse-sunset-4694.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Cologne Dom Rhine River",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-cologne-dom-rhine-river-8778.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-cologne-dom-rhine-river-8778.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cappadocia Uchisar Milestone",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/cappadocia-uchisar-milestone-17132.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/cappadocia-uchisar-milestone-17132.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Blue Sky And White Clouds",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/time-lapse-blue-sky-and-white-clouds-15308.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/time-lapse-blue-sky-and-white-clouds-15308.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Berlin Clouds Sky",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/berlin-clouds-sky-15183.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/berlin-clouds-sky-15183.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Hong Kong Harbour Hk",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/hong-kong-harbour-hk-17529.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/hong-kong-harbour-hk-17529.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Seaside Sunset Boat Beach",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/seaside-sunset-boat-beach-16721.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/seaside-sunset-boat-beach-16721.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cappadocia Uchisar Castle Canyon",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/cappadocia-uchisar-castle-canyon-17130.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/cappadocia-uchisar-castle-canyon-17130.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Gangtok Stadium Football Soccer",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/gangtok-stadium-football-soccer-14073.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/gangtok-stadium-football-soccer-14073.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunset Lakeshore Lake Water Shore",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/sunset-lakeshore-lake-water-shore-15977.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/sunset-lakeshore-lake-water-shore-15977.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Kaohsiung Time Lapse Port Ship",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/kaohsiung-time-lapse-port-ship-14914.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/kaohsiung-time-lapse-port-ship-14914.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Corn Food Cob Yellow Healthy Pot",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/corn-food-cob-yellow-healthy-pot-15976.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/corn-food-cob-yellow-healthy-pot-15976.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Yeouido Road Time Lapse",
    "poster": "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets/yeouido-road-time-lapse-18193.jpg",
    "videoUrl": "https://s3.us-east-2.amazonaws.com/drift-timelapse/xpcco/yeouido-road-time-lapse-18193.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.io",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }]
  // load if exist- only home page
  if (videoEl) {
    currentDataset = driftLibrary.allDataItems;
    driftLibrary.helpers.loadItems(currentDataset);
    driftLibrary.helpers.initializeView();
    driftLibrary.helpers.initializeEventHandlers();
  }