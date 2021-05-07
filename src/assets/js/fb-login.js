function login() {
  window.fbAsyncInit = function () {

    FB.init({
      appId: '2915126152079198',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v10.0'
    });

    FB.login(function (response) {
      console.log(response);
      localStorage.setItem("fb-user-accessToken", response.authResponse.accessToken);
      localStorage.setItem("fb-user-id", response.authResponse.userID);
      document.getElementById('hidden-button-click').click();
    }, {
      scope: ['public_profile', 'email', 'pages_messaging', 'pages_messaging_subscriptions',
        'pages_manage_metadata']

    });
  };
}




// -----------------------------------------------------------------------------------------------
function allPermissionsGranted() {
  var permissions = ['public_profile', 'email', 'pages_messaging', 'pages_messaging_subscriptions',
    'pages_manage_metadata']
  var flag = false;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

      const permissionsGranted = JSON.parse(xhttp.responseText)
      // Typical action to be performed when the document is ready:
      for (var i = 0; i < permissionsGranted.data.length; i++) {

        for (var k = 0; k < permissions.length; k++) {

          if (permissions[k] == (permissionsGranted.data[k].permission)) {
            // console.log(permissionsGranted.data[i].permission)
            flag = false;
            break;
          } else {
            flag = true;
          }
        }

        if (flag) {
          FB.login(function (response) {
            console.log(response);
            localStorage.setItem("fb-user-accessToken", response.authResponse.accessToken);
            localStorage.setItem("fb-user-id", response.authResponse.userID);
            location.reload();

          }, {
            scope: ['public_profile', 'email', 'pages_messaging', 'pages_messaging_subscriptions',
              'pages_manage_metadata', 'business_management', 'pages_read_engagement', 'pages_read_user_content',
              'pages_manage_ads', 'pages_manage_engagement']
          });
          break;
        }


      }
    }
  };
  xhttp.open("GET", "https://graph.facebook.com/${localStorage.getItem('fb-user-id')}/permissions?access_token=${localStorage.getItem('fb-user-accessToken')}", true);
  xhttp.send();
}