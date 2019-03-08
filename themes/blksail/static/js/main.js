// POST form data to Webhook on submit
function contact() {

  var data = {
    email: $('#email').val()
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

  $.ajax(request).done(function (response) {
    // console.log(response);
    // Update the label after a successful submission
    $("#contact-response").text("Thank you for subscribing!").css({'color': '#51ecaf', 'display': 'block'});
  }).fail(function( jqXHR, textStatus ) {
    console.log(textStatus);
  });

  return false; // to stop redirecting
}
