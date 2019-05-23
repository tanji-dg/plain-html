new Vue({
  el: "#app",
  data: {
     xChild: 0,
      yChild: 0,
      xParent: 0,
      yParent: 0,
      hover: false,
      hideCursor: true
  },
  mounted() {
    const moveCursor = e => {
      this.hideCursor = false;
      this.xChild = e.clientX ? e.clientX : e.touches[0].clientX;
      this.yChild = e.clientY ? e.clientY : e.touches[0].clientY;
      setTimeout(() => {
        this.xParent =
          e.clientX - 15 ? e.clientX - 15 : e.touches[0].clientX - 15;
        this.yParent =
          e.clientY - 15 ? e.clientY - 15 : e.touches[0].clientY - 15;
      }, 100);
    };
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("touchmove", moveCursor);
    window.addEventListener("touchstart", () => {
      this.hideCursor = false;
    });
    window.addEventListener("touchend", () => {
      this.hideCursor = true;
    });
  }
})