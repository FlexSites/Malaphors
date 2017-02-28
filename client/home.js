
(function ($) {
  console.log(window.location.pathname)
  $(function () {
    var $text = $('#text')
    var $author = $('#author')
    var $content = $('#content')

    if (window.location.pathname === '/') {
      getNext()
    }

    $('#share').jsSocials({
      shares: [ 'email', 'twitter', 'facebook', 'googleplus', 'pinterest' ],
      showCount: true,
      shareIn: 'popup',
      url: window.location.href,
    })

    $('#next').on('click', getNext)
    $('#back').on('click', function () {
      window.history.back()
      setTimeout(function () {
        load('/api' + window.location.pathname, updateDom)
      }, 100)
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
