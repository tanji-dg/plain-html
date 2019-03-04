// POST form data to Webhook on submit
function contact() {

  var data = {
    email: $('#mce-EMAIL').val()
  };

  /* Preparing the request with method, headers, url and data (body or payload)
 * Correct content type header is "application/json". 
 * To avoid CORS from Webbrowser-based repl.it please use "text/plain".
 */
var request = {
  url: "https://hooks.zapier.com/hooks/catch/439952/peam5v/silent/", // URL please use HTTPS
  method: "post", // HTTP verb/method
  headers: { // header information
    "Accept": "application/json", // accept type (optional)
    "Content-Type": "text/plain" // content type ("application/json"; "text/plain" to avoid CORS)
  },
  data: JSON.stringify(data) // stringify converts a JavaScript object into a string
};

// Make http/ajax call and handle response in embedded function
  /* $.ajax({
    url: 'https://hooks.zapier.com/hooks/catch/439952/peam5v/silent/',
    type: 'post',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    // $('#mc-embedded-subscribe-form').serialize()
    data: JSON.stringify(data),
    success: function (data, status) {
      console.log(status);
      console.log('Data is: ' + data);
      // Change the labels
      // Redirect to another success page
      //window.location = "/";
    },
    error:function(jqXHR, exception){
      console.log('Error :' + jqXHR.status + ' : ' + jqXHR.responseText);
    } 
  }); */

  $.ajax(request).done(function (response) {
    console.log(response);
  }).fail(function( jqXHR, textStatus ) {
    console.log(textStatus);
  });

  return false; // to stop redirecting
}
