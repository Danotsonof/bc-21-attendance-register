

$(document).ready(function(){

  $('form.login-form').on('submit', function(){

      var user = $( 'form.login-form' ).serialize();
      $.ajax({
        type: 'POST',
        url: '/',
        data: user,
        success: function(data){
          console.log(data);
          if (data.firstname =='admin' && data.lastname == 'admin' && data.password == 'admin'){
              window.location.href = 'admin';
          } else{
            alert('Successfully registered');
            location.reload();
          }

        },
        error: function (jqXHR, exception) {
          alert('Wrong Details');
          location.reload();
        }
      });

      return false;

  });
});
