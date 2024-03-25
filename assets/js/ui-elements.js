function clickLogo() {
    var currentUrl = window.location.href;
    var baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/";
    window.location.href = baseUrl;
}
