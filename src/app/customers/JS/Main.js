var MainController;
require(["OutageApp/AppController", "esri/urlUtils", "dojo/domReady!"], function (AppController, urlUtils) {
    if (configuration.proxyEnabled) {
        urlUtils.addProxyRule({
            urlPrefix: configuration.outageServicesArcServerURL,
            proxyUrl: configuration.proxyURL
        });
    }
    //
    MainController = new AppController();
});