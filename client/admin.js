(function ($) {
  $(function () {
    $('#next').on('click', () => window.location.reload())

    $('#save').on('click', () => {
      $.ajax({
        url: '/',
        method: 'POST',
        contentType: 'application/json',
        complete: () => window.location.reload(),
        data: JSON.stringify({
          text: $('#text').text().trim(),
          author: $('#author').text().trim().replace(/^- /, ''),
        }),
      })
    })
  })
}(window.jQuery))
