$(document).ready(() => {
  var swiper = new Swiper(".main-swiper .swiper-container", {
    speed: 3000,
    parallax: !0,
    // preloadImages: false,
    autoHeight: 1,
    preloadImages: true,
    lazy: false,
    // lazy: {
    //   loadPrevNext: true,
    // },
    slidesPerView: 1,
    autoplay: {
      delay: 4000,
    },
    pagination: {
      el: ".main-swiper .swiper-pagination",
      clickable: !0,
    },

    loop: true,

  });


});
