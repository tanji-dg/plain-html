(function($){
  $(function(){

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space





//sticky menu
window.onscroll = function() {stickyfunc()};
const header = document.getElementById("navtop");
const sticky = header.offsetTop;
function stickyfunc() {
  if (window.pageYOffset > sticky) {
    header.classList.remove("sticky");
  } else {
    header.classList.add("sticky");
  }
}
// End sticky menu
