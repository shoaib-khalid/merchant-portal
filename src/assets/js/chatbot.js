function showChatBotIcon() {
    if (localStorage.getItem("accessToken") == null) {
        var chatbox = document.getElementById('fb-customer-chat');
        chatbox.setAttribute("page_id", "104750211712782");
        chatbox.setAttribute("attribution", "biz_inbox");

        window.fbAsyncInit = function () {
            FB.init({
                xfbml: true,
                version: 'v12.0'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    } else {
        (function (w, d, s, u) {
            w.RocketChat = function (c) { w.RocketChat._.push(c) }; w.RocketChat._ = []; w.RocketChat.url = u;
            var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
            j.async = true; j.src = 'https://support.symplified.it/livechat/rocketchat-livechat.min.js?_=201903270000';
            h.parentNode.insertBefore(j, h);
        })(window, document, 'script', 'https://support.symplified.it/livechat');
    }

}

