$(function(){
  $('#share').jsSocials({
    shares: ["email", "twitter", "facebook", "googleplus", "pinterest"],
    showCount: true,
    shareIn: "popup",
    url: window.location.href
  });
});
