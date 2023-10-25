chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.token){
        console.log("inject token",request.token);
        const cookieName = "token";
        document.cookie = `${cookieName}=${request.token}; domain=.prakerja.go.id; path=/`
        location.reload();
        sendResponse({msg: "token injected"});
    }
    }
  );