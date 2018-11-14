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
  let searchBarEl = document.getElementsByClassName("search-text")[0];
  let searchIconEl = document.getElementsByClassName("search-submit")[0];
  let searchClearEl = document.getElementsByClassName("search-clear")[0];
  let searchResultStatusEl = document.getElementById("search-result-status");
  let bodyEl = document.getElementsByTagName("body")[0];
  let currentDataset = [],
    searchDataset = [],
    isSearchData = false;

  driftLibrary.helpers = {
    toggleModal: function (ref) {
      ref = ref.parentElement.getElementsByClassName("content-box-thumb")[0];
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
          document.getElementsByClassName("drift-download")[0].href = ref.getAttribute("data-videoUrl");
          document.getElementsByClassName("contributer-name")[0].innerHTML = "by <a href='" + ref.getAttribute("data-contributer-link") + "'>" +
            ref.getAttribute("data-contributer") + "</a";
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
        <div class="inner"><img src="./assets/vpl.jpg" class="video-pl-icon" onclick=" driftLibrary.helpers.toggleModal(this)">
        <img data-contributer="${item.contributer}" data-contributer-link="${item.contributerLink}" onclick=" driftLibrary.helpers.toggleModal(this)" 
        data-videoUrl="${driftLibrary.dataVariables.cloudFrontVideoRoot + item.videoUrl}" class="content-box-thumb" src="${ driftLibrary.dataVariables.cloudFrontAssetsRoot + item.poster}" 
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
      opIn += opIn * 0.2;

    },

    fadeOut: function (element) {
      if (opOut <= 0.1) {
        clearInterval(timerOut);
        element.style.display = "none";
      }
      element.style.opacity = opOut;
      opOut -= opOut * 0.2;

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
        e.preventDefault();

        if (searchBarEl.value && searchBarEl.value.length > 0) {
          if (isSearchData) {
            isSearchData = false;
            currentDataset = driftLibrary.allDataItems;
            self.clearAllItems();
            self.loadItems(currentDataset);

          } else {
            isSearchData = true;
            self.dataSearch(searchBarEl.value);

          }
        } else {
          return;
        }

      });

      searchClearEl.addEventListener("click", function (e) {
        isSearchData = false;
        e.preventDefault();
        searchBarEl.value = "";
        searchResultStatusEl.style.display = "none";

      });

      searchBarEl.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {

          e.preventDefault();
          self.searchViewUpdate(searchClearEl, "clear");
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
        searchResultStatusEl.style.display = "block";
        searchResultStatusEl.innerHTML = "Showing results for '" + searchText + "'";
        currentDataset = searchDataset;
        this.clearAllItems();
        this.loadItems(currentDataset);

      } else {
        searchResultStatusEl.innerHTML = "Sorry !! No results found for '" + searchText + "'";
        searchResultStatusEl.style.display = "block"
      }
    },

    searchViewUpdate: function (element, state) {
      if (state == "clear") {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }

      searchResultStatusEl.style.display = "none";

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

  driftLibrary.dataVariables = {
    s3AssetsRoot: "https://s3.us-east-2.amazonaws.com/drift-timelapse/assets",
    s3VideoRoot: "https://s3.us-east-2.amazonaws.com/drift-timelapse",
    cloudFrontVideoRoot: "https://d1xwcjm8hjd4g.cloudfront.net",
    cloudFrontAssetsRoot: "https://d1xwcjm8hjd4g.cloudfront.net/assets"
  }

  driftLibrary.allDataItems = [{
    "title": "Clouds Blue Sky Sky Nature Day",
    "poster": "/clouds-blue-sky-sky-nature-day-9825.jpg",
    "videoUrl": "/xpcco/clouds-blue-sky-sky-nature-day-9825.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cloud Time Lapse Sky Clouds Blue",
    "poster": "/cloud-time-lapse-sky-clouds-blue-2142.jpg",
    "videoUrl": "/xpcco/cloud-time-lapse-sky-clouds-blue-2142.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "River Ship Evening Romantic",
    "poster": "/river-ship-evening-romantic-6815.jpg",
    "videoUrl": "/xpcco/river-ship-evening-romantic-6815.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Car Road Transportation Vehicle",
    "poster": "/car-road-transportation-vehicle-2165.jpg",
    "videoUrl": "/xpcco/car-road-transportation-vehicle-2165.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Lights Houses Streets Sissach",
    "poster": "/lights-houses-streets-sissach-13441.jpg",
    "videoUrl": "/xpcco/lights-houses-streets-sissach-13441.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Train Rail Weather Railroad",
    "poster": "/train-rail-weather-railroad-2213.jpg",
    "videoUrl": "/xpcco/train-rail-weather-railroad-2213.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Full Moon Moon Night Hyper Lapse",
    "poster": "/full-moon-moon-night-hyper-lapse-2144.jpg",
    "videoUrl": "/xpcco/full-moon-moon-night-hyper-lapse-2144.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Sunset Winter Snow",
    "poster": "/time-lapse-sunset-winter-snow-6975.jpg",
    "videoUrl": "/xpcco/time-lapse-sunset-winter-snow-6975.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clock Camera Quick Passage Of Time",
    "poster": "/clock-camera-quick-passage-of-time-3019.jpg",
    "videoUrl": "/xpcco/clock-camera-quick-passage-of-time-3019.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Clouds Landscape",
    "poster": "/time-lapse-clouds-landscape-7001.jpg",
    "videoUrl": "/xpcco/time-lapse-clouds-landscape-7001.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunrise Morning Sun Morgenstimmung",
    "poster": "/sunrise-morning-sun-morgenstimmung-12671.jpg",
    "videoUrl": "/xpcco/sunrise-morning-sun-morgenstimmung-12671.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Car Traffic Road Travel City",
    "poster": "/car-traffic-road-travel-city-5715.jpg",
    "videoUrl": "/xpcco/car-traffic-road-travel-city-5715.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Mountains Clouds Nature Landscape",
    "poster": "/mountains-clouds-nature-landscape-4406.jpg",
    "videoUrl": "/xpcco/mountains-clouds-nature-landscape-4406.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Flowers Nature Time Blossom Leaf",
    "poster": "/flowers-nature-time-blossom-leaf-7924.jpg",
    "videoUrl": "/xpcco/flowers-nature-time-blossom-leaf-7924.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Tree Cloudy Sky Sky Clouds",
    "poster": "/clouds-tree-cloudy-sky-sky-clouds-2149.jpg",
    "videoUrl": "/xpcco/clouds-tree-cloudy-sky-sky-clouds-2149.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Electricity Wires Time Lapse Sunset",
    "poster": "/electricity-wires-time-lapse-sunset-2151.jpg",
    "videoUrl": "/xpcco/electricity-wires-time-lapse-sunset-2151.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunset Time Lapse Clouds Mood Sky",
    "poster": "/sunset-time-lapse-clouds-mood-sky-9783.jpg",
    "videoUrl": "/xpcco/sunset-time-lapse-clouds-mood-sky-9783.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Sun Clouds Sky Sunset",
    "poster": "/time-lapse-sun-clouds-sky-sunset-12767.jpg",
    "videoUrl": "/xpcco/time-lapse-sun-clouds-sky-sunset-12767.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Subway Seoul Tunnel Travel Drive",
    "poster": "/subway-seoul-tunnel-travel-drive-14037.jpg",
    "videoUrl": "/xpcco/subway-seoul-tunnel-travel-drive-14037.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Shopping Pedestrian Time Lapse City",
    "poster": "/shopping-pedestrian-time-lapse-city-2121.jpg",
    "videoUrl": "/xpcco/shopping-pedestrian-time-lapse-city-2121.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Weather Cloudiness Sky Forward",
    "poster": "/weather-cloudiness-sky-forward-11057.jpg",
    "videoUrl": "/xpcco/weather-cloudiness-sky-forward-11057.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Flower Sky Clouds Processing",
    "poster": "/flower-sky-clouds-processing-4072.jpg",
    "videoUrl": "/xpcco/flower-sky-clouds-processing-4072.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Lake Blue Sky Scenic Clouds",
    "poster": "/lake-blue-sky-scenic-clouds-2422.jpg",
    "videoUrl": "/xpcco/lake-blue-sky-scenic-clouds-2422.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "White Clouds Blue Sky Summer",
    "poster": "/white-clouds-blue-sky-summer-2093.jpg",
    "videoUrl": "/xpcco/white-clouds-blue-sky-summer-2093.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Morgenrot Sunrise Clouds Sky Mood",
    "poster": "/morgenrot-sunrise-clouds-sky-mood-12766.jpg",
    "videoUrl": "/xpcco/morgenrot-sunrise-clouds-sky-mood-12766.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Mountains Austria Time Lapse Hiking",
    "poster": "/mountains-austria-time-lapse-hiking-1805.jpg",
    "videoUrl": "/xpcco/mountains-austria-time-lapse-hiking-1805.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Highway Traffic Lights Vehicles",
    "poster": "/highway-traffic-lights-vehicles-12769.jpg",
    "videoUrl": "/xpcco/highway-traffic-lights-vehicles-12769.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Supermarket Cart Market Mall Buy",
    "poster": "/supermarket-cart-market-mall-buy-1735.jpg",
    "videoUrl": "/xpcco/supermarket-cart-market-mall-buy-1735.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Bern Switzerland Rose Garden",
    "poster": "/bern-switzerland-rose-garden-7033.jpg",
    "videoUrl": "/xpcco/bern-switzerland-rose-garden-7033.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Astrology Astronomy Astrophotography",
    "poster": "/astrology-astronomy-astrophotography-2528.jpg",
    "videoUrl": "/xpcco/astrology-astronomy-astrophotography-2528.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Waterfall Cascade Forest Fall",
    "poster": "/waterfall-cascade-forest-fall-1702.jpg",
    "videoUrl": "/xpcco/waterfall-cascade-forest-fall-1702.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Car Road Auto Transportation",
    "poster": "/car-road-auto-transportation-1906.jpg",
    "videoUrl": "/xpcco/car-road-auto-transportation-1906.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Lake Water Landscape Scenery",
    "poster": "/lake-water-landscape-scenery-1905.jpg",
    "videoUrl": "/xpcco/lake-water-landscape-scenery-1905.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Watzmann Time Lapse Mountains",
    "poster": "/watzmann-time-lapse-mountains-12792.jpg",
    "videoUrl": "/xpcco/watzmann-time-lapse-mountains-12792.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Landscape Lake Clouds Nature Sky",
    "poster": "/landscape-lake-clouds-nature-sky-2900.jpg",
    "videoUrl": "/xpcco/landscape-lake-clouds-nature-sky-2900.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Dubrovnik Sunset Sea City",
    "poster": "/dubrovnik-sunset-sea-city-12866.jpg",
    "videoUrl": "/xpcco/dubrovnik-sunset-sea-city-12866.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunset Beach North Sea Sand Beach",
    "poster": "/sunset-beach-north-sea-sand-beach-1757.jpg",
    "videoUrl": "/xpcco/sunset-beach-north-sea-sand-beach-1757.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Thunderstorm Storm Time Lapse",
    "poster": "/thunderstorm-storm-time-lapse-9451.jpg",
    "videoUrl": "/xpcco/thunderstorm-storm-time-lapse-9451.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "La Crusc Church Monastery Refuge",
    "poster": "/la-crusc-church-monastery-refuge-4993.jpg",
    "videoUrl": "/xpcco/la-crusc-church-monastery-refuge-4993.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Highway Rain Auto Storm Fast",
    "poster": "/highway-rain-auto-storm-fast-3277.jpg",
    "videoUrl": "/xpcco/highway-rain-auto-storm-fast-3277.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Weather Atmosphere Time Sky",
    "poster": "/clouds-weather-atmosphere-time-sky-695.jpg",
    "videoUrl": "/xpcco/clouds-weather-atmosphere-time-sky-695.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Timelaps Monastery Ruin",
    "poster": "/time-lapse-timelaps-monastery-ruin-2876.jpg",
    "videoUrl": "/xpcco/time-lapse-timelaps-monastery-ruin-2876.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Clouds Blue Sky Nature",
    "poster": "/time-lapse-clouds-blue-sky-nature-12660.jpg",
    "videoUrl": "/xpcco/time-lapse-clouds-blue-sky-nature-12660.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "River Tyne River Bridge Time Lapse",
    "poster": "/river-tyne-river-bridge-time-lapse-1400.jpg",
    "videoUrl": "/xpcco/river-tyne-river-bridge-time-lapse-1400.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Timelapse Sky Nature",
    "poster": "/clouds-timelapse-sky-nature-8884.jpg",
    "videoUrl": "/xpcco/clouds-timelapse-sky-nature-8884.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Origami Paper Bend Plane Isolated",
    "poster": "/origami-paper-bend-plane-isolated-9081.jpg",
    "videoUrl": "/xpcco/origami-paper-bend-plane-isolated-9081.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Easter Bright Burn Burning Candle",
    "poster": "/easter-bright-burn-burning-candle-2531.jpg",
    "videoUrl": "/xpcco/easter-bright-burn-burning-candle-2531.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Bright Burn Burning Candle",
    "poster": "/bright-burn-burning-candle-2530.jpg",
    "videoUrl": "/xpcco/bright-burn-burning-candle-2530.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Clouds Sky Atmosphere",
    "poster": "/time-lapse-clouds-sky-atmosphere-9041.jpg",
    "videoUrl": "/xpcco/time-lapse-clouds-sky-atmosphere-9041.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "North Sea Time Lapse Sea",
    "poster": "/north-sea-time-lapse-sea-11220.jpg",
    "videoUrl": "/xpcco/north-sea-time-lapse-sea-11220.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Night Lapse Night Time Nature Sky",
    "poster": "/night-lapse-night-time-nature-sky-1341.jpg",
    "videoUrl": "/xpcco/night-lapse-night-time-nature-sky-1341.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Beach Coast Sea Time Lapse Usedom",
    "poster": "/beach-coast-sea-time-lapse-usedom-3894.jpg",
    "videoUrl": "/xpcco/beach-coast-sea-time-lapse-usedom-3894.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Timelapse Sky Nature",
    "poster": "/clouds-timelapse-sky-nature-8883.jpg",
    "videoUrl": "/xpcco/clouds-timelapse-sky-nature-8883.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Nature Landscape Time Lapse Video",
    "poster": "/nature-landscape-time-lapse-video-18586.jpg",
    "videoUrl": "/xpcco/nature-landscape-time-lapse-video-18586.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cowichan Vancouver Island Canada",
    "poster": "/cowichan-vancouver-island-canada-16380.jpg",
    "videoUrl": "/xpcco/cowichan-vancouver-island-canada-16380.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Full Moon Fog Sky",
    "poster": "/time-lapse-full-moon-fog-sky-7014.jpg",
    "videoUrl": "/xpcco/time-lapse-full-moon-fog-sky-7014.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sky Rays Time Lapse Clouds Sun",
    "poster": "/sky-rays-time-lapse-clouds-sun-5151.jpg",
    "videoUrl": "/xpcco/sky-rays-time-lapse-clouds-sun-5151.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Star Long Exposure Time Lapse",
    "poster": "/star-long-exposure-time-lapse-8097.jpg",
    "videoUrl": "/xpcco/star-long-exposure-time-lapse-8097.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sun Clouds Time Lapse Light Lake",
    "poster": "/sun-clouds-time-lapse-light-lake-6343.jpg",
    "videoUrl": "/xpcco/sun-clouds-time-lapse-light-lake-6343.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cable Car London Motion",
    "poster": "/cable-car-london-motion-3603.jpg",
    "videoUrl": "/xpcco/cable-car-london-motion-3603.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Church Clock Tower Architecture",
    "poster": "/church-clock-tower-architecture-3696.jpg",
    "videoUrl": "/xpcco/church-clock-tower-architecture-3696.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Sunset Sky Landscape",
    "poster": "/clouds-sunset-sky-landscape-5932.jpg",
    "videoUrl": "/xpcco/clouds-sunset-sky-landscape-5932.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "G%c3%a4ggersteg Hyperlapse Nature",
    "poster": "/g%C3%A4ggersteg-hyperlapse-nature-9651.jpg",
    "videoUrl": "/xpcco/g%C3%A4ggersteg-hyperlapse-nature-9651.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Night Barcelona City Bus Station",
    "poster": "/night-barcelona-city-bus-station-4371.jpg",
    "videoUrl": "/xpcco/night-barcelona-city-bus-station-4371.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Lake Blue Sky Scenic Clouds",
    "poster": "/lake-blue-sky-scenic-clouds-2424.jpg",
    "videoUrl": "/xpcco/lake-blue-sky-scenic-clouds-2424.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Berlin City Tv Tower Time Lapse",
    "poster": "/berlin-city-tv-tower-time-lapse-10165.jpg",
    "videoUrl": "/xpcco/berlin-city-tv-tower-time-lapse-10165.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunset Sea Landscape Sky Coast",
    "poster": "/sunset-sea-landscape-sky-coast-8653.jpg",
    "videoUrl": "/xpcco/sunset-sea-landscape-sky-coast-8653.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Water Boat Time Lapse Yacht Sea",
    "poster": "/water-boat-time-lapse-yacht-sea-1907.jpg",
    "videoUrl": "/xpcco/water-boat-time-lapse-yacht-sea-1907.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Junction Time Lapse Traffic Autos",
    "poster": "/junction-time-lapse-traffic-autos-10103.jpg",
    "videoUrl": "/xpcco/junction-time-lapse-traffic-autos-10103.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sushi Doing Dinner Meal",
    "poster": "/sushi-doing-dinner-meal-5692.jpg",
    "videoUrl": "/xpcco/sushi-doing-dinner-meal-5692.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Timelapse Port Time Lapse",
    "poster": "/timelapse-port-time-lapse-10909.jpg",
    "videoUrl": "/xpcco/timelapse-port-time-lapse-10909.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Timelapse Port Time Lapse",
    "poster": "/timelapse-port-time-lapse-10910.jpg",
    "videoUrl": "/xpcco/timelapse-port-time-lapse-10910.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Strommast Clouds Sky Power Poles",
    "poster": "/strommast-clouds-sky-power-poles-10749.jpg",
    "videoUrl": "/xpcco/strommast-clouds-sky-power-poles-10749.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sky Cloud Time Lapse Blue Weather",
    "poster": "/sky-cloud-time-lapse-blue-weather-19050.jpg",
    "videoUrl": "/xpcco/sky-cloud-time-lapse-blue-weather-19050.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sushi Doing Dinner Meal",
    "poster": "/sushi-doing-dinner-meal-5693.jpg",
    "videoUrl": "/xpcco/sushi-doing-dinner-meal-5693.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sky Outdoor Nature Cloud Beautiful",
    "poster": "/sky-outdoor-nature-cloud-beautiful-18919.jpg",
    "videoUrl": "/xpcco/sky-outdoor-nature-cloud-beautiful-18919.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Clouds Sky Time Lapse Summer Blue",
    "poster": "/clouds-sky-time-lapse-summer-blue-8717.jpg",
    "videoUrl": "/xpcco/clouds-sky-time-lapse-summer-blue-8717.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Mexico City Time Lapse Mexico",
    "poster": "/mexico-city-time-lapse-mexico-10527.jpg",
    "videoUrl": "/xpcco/mexico-city-time-lapse-mexico-10527.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Himalaya Annapurna Sunrise Nepal",
    "poster": "/himalaya-annapurna-sunrise-nepal-14323.jpg",
    "videoUrl": "/xpcco/himalaya-annapurna-sunrise-nepal-14323.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Highway Autos Traffic Vehicles",
    "poster": "/highway-autos-traffic-vehicles-9117.jpg",
    "videoUrl": "/xpcco/highway-autos-traffic-vehicles-9117.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Cologne Dom Rhine River",
    "poster": "/time-lapse-cologne-dom-rhine-river-8820.jpg",
    "videoUrl": "/xpcco/time-lapse-cologne-dom-rhine-river-8820.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Karlsruhe Clouds Time Lapse Sunset",
    "poster": "/karlsruhe-clouds-time-lapse-sunset-4694.jpg",
    "videoUrl": "/xpcco/karlsruhe-clouds-time-lapse-sunset-4694.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Cologne Dom Rhine River",
    "poster": "/time-lapse-cologne-dom-rhine-river-8778.jpg",
    "videoUrl": "/xpcco/time-lapse-cologne-dom-rhine-river-8778.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cappadocia Uchisar Milestone",
    "poster": "/cappadocia-uchisar-milestone-17132.jpg",
    "videoUrl": "/xpcco/cappadocia-uchisar-milestone-17132.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Time Lapse Blue Sky And White Clouds",
    "poster": "/time-lapse-blue-sky-and-white-clouds-15308.jpg",
    "videoUrl": "/xpcco/time-lapse-blue-sky-and-white-clouds-15308.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Berlin Clouds Sky",
    "poster": "/berlin-clouds-sky-15183.jpg",
    "videoUrl": "/xpcco/berlin-clouds-sky-15183.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Hong Kong Harbour Hk",
    "poster": "/hong-kong-harbour-hk-17529.jpg",
    "videoUrl": "/xpcco/hong-kong-harbour-hk-17529.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Seaside Sunset Boat Beach",
    "poster": "/seaside-sunset-boat-beach-16721.jpg",
    "videoUrl": "/xpcco/seaside-sunset-boat-beach-16721.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Cappadocia Uchisar Castle Canyon",
    "poster": "/cappadocia-uchisar-castle-canyon-17130.jpg",
    "videoUrl": "/xpcco/cappadocia-uchisar-castle-canyon-17130.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Gangtok Stadium Football Soccer",
    "poster": "/gangtok-stadium-football-soccer-14073.jpg",
    "videoUrl": "/xpcco/gangtok-stadium-football-soccer-14073.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Sunset Lakeshore Lake Water Shore",
    "poster": "/sunset-lakeshore-lake-water-shore-15977.jpg",
    "videoUrl": "/xpcco/sunset-lakeshore-lake-water-shore-15977.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Kaohsiung Time Lapse Port Ship",
    "poster": "/kaohsiung-time-lapse-port-ship-14914.jpg",
    "videoUrl": "/xpcco/kaohsiung-time-lapse-port-ship-14914.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Corn Food Cob Yellow Healthy Pot",
    "poster": "/corn-food-cob-yellow-healthy-pot-15976.jpg",
    "videoUrl": "/xpcco/corn-food-cob-yellow-healthy-pot-15976.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }, {
    "title": "Yeouido Road Time Lapse",
    "poster": "/yeouido-road-time-lapse-18193.jpg",
    "videoUrl": "/xpcco/yeouido-road-time-lapse-18193.mp4",
    "isYoutube": false,
    "embedId": "",
    "contributer": "Project Drift",
    "contributerLink": "http://projectdrift.co",
    "license": "CC0 Creative Commons Free for commercial use No attribution required"
  }]
  // load if exist- only home page
  if (videoEl) {
    currentDataset = driftLibrary.allDataItems;
    driftLibrary.helpers.loadItems(currentDataset);
    driftLibrary.helpers.initializeView();
    driftLibrary.helpers.initializeEventHandlers();
  }