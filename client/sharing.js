
(function ($) {
  $(function () {
    $('#share').jsSocials({
      shares: [ 'email', 'twitter', 'facebook', 'googleplus', 'pinterest' ],
      showCount: true,
      shareIn: 'popup',
      url: window.location.href,
    })
    // $(window).keypress(function (e) {
    //   if (e.keyCode === 0 || e.keyCode === 32) {
    //     e.preventDefault()
    //     window.location.reload()
    //   }
    // })
  })
}(window.jQuery))
