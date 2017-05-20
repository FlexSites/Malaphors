(function ($) {
  $(function () {
    $('#next').on('click', () => window.location.reload())

    var token = /\?token=([^&]+)/.exec(window.location.href)[1]
    console.log(token);
    $('#save').on('click', () => {
      $.ajax({
        url: `/?token=${ token }`,
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
