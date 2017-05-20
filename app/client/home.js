
(function ($) {
  console.log(window.location.pathname)
  $(function () {
    var $text = $('#text')
    var $author = $('#author')
    var $content = $('#content')
    var $next = $('#next')
    var $back = $('#back')



    var IS_MOBILE = window.matchMedia('(max-width: 767px)')

    if (IS_MOBILE) {
      $('#content')
        .swipe({
          // Generic swipe handler for all directions
          swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (direction === 'left') {
              getNext()
            } else if (direction === 'right') {
              window.history.back()
              window.location.reload()
            }
          },
          // Default is 75px, set to 0 for demo so any distance triggers swipe
          threshold: 0,
        })
    } else {
      if (window.location.pathname === '/') {
        getNext()
        $next.on('click', getNext)
      }
      $back.on('click', function () {
        window.history.back()
        setTimeout(function () {
          load('/api' + window.location.pathname, updateDom)
        }, 100)
      })
    }

    $('#share').jsSocials({
      shares: [ 'email', 'twitter', 'facebook', 'googleplus', 'pinterest' ],
      showCount: true,
      shareIn: 'popup',
      url: window.location.href,
    })


    function getNext () {
      var nextUrl = window.localStorage.getItem('nextIdiomHref') || '/api/random'
      load(nextUrl, newDataCallback)
    }

    function load (url, cb) {

      console.info('loading', url)
      $.ajax(url, {
        complete: function (data) {
          cb(null, data.responseJSON)
        },
      })
    }

    function updateDom (err, data) {
      if (err) {
        console.error(err)
        return
      }
      $text.text(data.text)
      $author.text('- ' + data.author)
      console.log('background-image', 'url(' + data.background + ')')
      $content.css('background-image', 'url(' + data.background + ')')
    }

    function updateHistory (err, data) {
      if (err) {
        console.error(err)
        return
      }
      window.history.pushState({}, data.text, data.href)
      window.localStorage.setItem('nextIdiomHref', data.next)
    }

    function newDataCallback (err, data) {
      if (err) {
        console.error(err)
        return
      }
      updateDom(null, data)
      updateHistory(null, data)
    }
  })
}(window.jQuery))
