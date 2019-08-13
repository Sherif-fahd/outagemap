define(
    [
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/connect",
        "esri/request",
        "esri/map",
        "esri/geometry/Extent",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer", "esri/InfoTemplate",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Point",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/layers/LayerDrawingOptions",
        "esri/renderers/SimpleRenderer",
        "esri/graphic",
        "esri/renderers/UniqueValueRenderer",
        "esri/Color",
        "esri/dijit/HomeButton",
        "esri/dijit/Legend",
        "esri/dijit/LocateButton",
        "esri/dijit/Search"
    ],
    function (declare, lang,connect, esriRequest, Map, Extent, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer,
        FeatureLayer, InfoTemplate,GraphicsLayer,
        Point, SimpleMarkerSymbol, SimpleLineSymbol,PictureMarkerSymbol, LayerDrawingOptions, SimpleRenderer,
        Graphic, UniqueValueRenderer,Color, HomeButton, Legend, LocateButton, Search) {
        return declare(null, {
            AppMap: null,
            search: null,
            homeButton: null,
            geoLocate: null,
            legend: null,
            domNode: null,
            PowerOutagesFL: null,
            PendingOutageSymbole: new PictureMarkerSymbol('./Imges/MapSymbols/Pending.png', 32, 32),
            RestoredOutageSymbole: new PictureMarkerSymbol('./Imges/MapSymbols/Restored.png', 32, 32),
            RenderSymbol : new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,
                20,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                  new Color([255, 255, 255, 0.5]),
                  3
                ), new Color([205, 205, 190, 0.9])
              )
            ,
            Maps_toggleBaseMap:[],
            constructor: function (options) {
                this.domNode = options.mapDiv && options.mapDiv.id ? options.mapDiv : document.getElementById(options.mapDiv);
                this.AppMap = new Map(this.domNode, {
                    extent: new Extent(configuration.MapNavigation.InitialExtent),
                    logo: false,
                    sliderPosition: "bottom-right",
                    //sliderOrientation: "horizontal",
                    sliderStyle:"small"
                });

                this.AppMap.on("load", this.initMap.bind(this));//.apply is to keep the context to THIS object with asynchrnuse call, like lang .hitch
                this.AppMap.on("extent-change", this.ExtentChange.bind(this));
                this.baseMapLayers = this.AddLayers(configuration.MapNavigation.BaseMaps);
                this.initToggleBaseMap(this.baseMapLayers);
            }
            ,
            AddLayers: function (Layers, map) {
                var layersList = [];
                for (var i = 0; i < Layers.length; i++) {
                    var OplayerSettings = Layers[i];
                    var OpLayer = null;
                    switch (OplayerSettings.Type) {
                        case "dynamic":
                            OpLayer = new ArcGISDynamicMapServiceLayer(OplayerSettings.URL, { id: OplayerSettings.ID, visible: OplayerSettings.visible });
                            break;
                        case "tiled":
                            OpLayer = new ArcGISTiledMapServiceLayer(OplayerSettings.URL, { id: OplayerSettings.ID, visible: OplayerSettings.visible });
                            break;
                    }
                    if (OpLayer) {
                        if (OplayerSettings.Renderer) {
                            this.RenderLayer(OpLayer, OplayerSettings.Renderer);
                        }
                        if (!map)
                            this.AppMap.addLayer(OpLayer);
                        else
                            map.addLayer(OpLayer);
                        //OpLayer.Name = OplayerSettings.Name;
                        layersList.push(OpLayer);
                    }
                }
                return layersList;
            },
            RenderLayer: function (layer, renderer) {
                
                var layerDrawingOptions = [];
                var layerDrawingOption = new LayerDrawingOptions();

                layerDrawingOption.renderer = new SimpleRenderer(this.RenderSymbol);

                layerDrawingOptions[0] = layerDrawingOption;
                //layer.setLayerDrawingOptions(layerDrawingOptions);
            },
            initMap: function () {
                connect.publish("AppMapLoaded", {map:this.AppMap});
                this.initWidgets();
                this.getUserLocation();
                this.addOutageLayers();
            },
            addOutageLayers: function () {
                _thisMapNav = this;

                //create renderer
                var RedndererJSON = {
                    "type": "uniqueValue",
                    "field1": "STATUS",
                    "defaultSymbol": this.PendingOutageSymbole,
                    "uniqueValueInfos": [{
                        "value": "Un-Planned Pending",
                        "symbol": this.PendingOutageSymbole
                    }, {
                        "value": "Un-Planned Restored",
                        "symbol":this.RestoredOutageSymbole
                    },
                    {
                        "value": "Planned Restored",
                        "symbol": this.RestoredOutageSymbole
                    }, {
                        "value": "Planned Pending OverDue",
                        "symbol": this.PendingOutageSymbole
                    }
                    , {
                        "value": "Planned Pending",
                        "symbol": this.PendingOutageSymbole
                    }
                    ]
                }
                var renderer = new UniqueValueRenderer(RedndererJSON);
                //var renderer = new UniqueValueRenderer(this.PendingOutageSymbole, "REGIONID");

                //infoTemplate: new InfoTemplate("Power Outage Info ", "Affected Customer : ${AFFECTED_CUSTOMERS} <br/>Type:   ${ISPLANNED}<br/> Status : ${STATUS}"),
                var powerOutagesLayer= configuration.OutagesLayers[0];
                this.PowerOutagesFL = new FeatureLayer(powerOutagesLayer.URL, {
                    //infoTemplate: new InfoTemplate("Power Outage Info ", "Affected Customer : ${AFFECTED_CUSTOMERS} <br/>Type:   ${ISPLANNED}<br/> Status : ${STATUS}"),
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"],
                    visible: powerOutagesLayer.visible,
                    id: powerOutagesLayer.ID
                });

                this.PowerOutagesFL.on("mouse-over", function () {
                    _thisMapNav.AppMap.setMapCursor("pointer");
                });
                this.PowerOutagesFL.on("mouse-out", function () {
                    _thisMapNav.AppMap.setMapCursor("default");
                });

                this.PowerOutagesFL.setRenderer(renderer);
                this.AppMap.addLayer(this.PowerOutagesFL);
                this.PowerOutagesFL.on("click", this.OutageClicked.bind(this));
            },
            OutageClicked: function (evt) {
                connect.publish("populateOutageDetailsPanel", { outageFeature: evt.graphic, zoomtoOutage: true });
            },
            ExtentChange: function () {
                this.refreshToggleBaseMap();
            },
            refreshToggleBaseMap: function () {
                if (this.Maps_toggleBaseMap) {
                    for (var i = 0; i < this.Maps_toggleBaseMap.length; i++) {
                        this.Maps_toggleBaseMap[i].setExtent(this.AppMap.extent)
                    }
                }
            },
            getUserLocation: function () {
                if (configuration.getUserLocation) {
                    if (!this.locationGraohicsLayer) {
                        this.locationGraohicsLayer = new GraphicsLayer({ id: "locationGraphicsLayer" });
                        this.AppMap.addLayer(this.locationGraohicsLayer);
                    }
                    //
                    if (navigator.geolocation) {
                        connect.publish("ShowNoticiation", { message: "Retriving Location...", autoHide: false });
                        //MainController.Notfifcations.showNotifiation("Retriving Location...");
                        navigator.geolocation.getCurrentPosition(this.zoomToLocation.bind(this), this.locationError.bind(this));
                        //watchId = navigator.geolocation.watchPosition(this.showLocation.bind(this), this.locationError.bind(this));
                    } else {
                        alert("Browser doesn't support Geolocation. Visit http://caniuse.com to see browser support for the Geolocation API.");
                    }
                }
            },
            initWidgets: function () {
                //legend = new Legend({
                //    map: map,
                //    layerInfos: [{ layer: educationFeatureLayer, title: "Predominant Educational Attainment" }]
                //}, "legendDiv");
                //legend.startup();

                this.search = new Search({
                    map: this.AppMap,
                }, "ui-dijit-search");

                var sources = this.search.get("sources");
                if (sources && sources[0])//Limit search widgets to searhc addresses inside UAE
                    sources[0].countryCode = "AE";

                this.geoLocate = new LocateButton({
                    map: this.AppMap,

                }, "ui-dijit-locatebutton");

                this.geoLocate.on("locate", function (location) {
                    connect.publish("searchOutagesByBuffer", { location: location.graphic })
                });

                this.homeButton = new HomeButton({
                    map: this.AppMap,
                    theme: "HomeButton"
                }, "ui-home-button");

                this.search.startup();
                this.geoLocate.startup();
                this.homeButton.startup();
                //
            }
            ,
            locationError:function(error) {
                //error occurred so stop watchPosition
                //if( navigator.geolocation ) {
                //    navigator.geolocation.clearWatch(watchId);
                //}
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        connect.publish("ShowNoticiation", { message: "Location not provided, user didn't allow", autoHide: false });
                        //MainController.Notfifcations.showNotifiation("Location not provided, user didn't allow");
                        break;

                    case error.POSITION_UNAVAILABLE:
                        connect.publish("ShowNoticiation", { message: "Current location not available", autoHide: false });
                        //MainController.Notfifcations.showNotifiation("Current location not available");
                        break;

                    case error.TIMEOUT:
                        connect.publish("ShowNoticiation", { message: "Timeout", autoHide: false });
                        //MainController.Notfifcations.showNotifiation("Timeout");
                        break;

                    default:
                        connect.publish("ShowNoticiation", { message: "Location unknown error", autoHide: false });
                        //MainController.Notfifcations.showNotifiation("Location unknown error");
                        break;
                }
            },
            zoomToLocation: function (location) {
                var pt = new Point(location.coords.longitude, location.coords.latitude);
                this.addLocationGraphic(pt);
                this.AppMap.centerAndZoom(pt, configuration.userLocationScale);
                connect.publish("hideNotification");
                //MainController.Notfifcations.hide();

                var userLocation = {};
                userLocation.geometry = pt;
                connect.publish("searchOutagesByBuffer", { location: userLocation });
            }
            ,
            //showLocation:function(location) {
            //    //zoom to the users location and add a graphic
            //    var pt = new Point(location.coords.longitude, location.coords.latitude);
            //    if (!this.userLocationGraphic) {
            //        this.addGraphic(pt);
            //    } else { // move the graphic if it already exists
            //        this.userLocationGraphic.setGeometry(pt);
            //    }
            //    this.AppMap.centerAt(pt);
            //},
            addLocationGraphic: function (pt) {
                var symbol = new SimpleMarkerSymbol(
                  SimpleMarkerSymbol.STYLE_CIRCLE,
                  12,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([0, 0, 30, 0.5]),
                    8
                  ),
                  new Color([0, 30, 230, 0.9])
                );
                this.userLocationGraphic = new Graphic(pt, symbol);
                if (this.locationGraohicsLayer)
                    this.locationGraohicsLayer.add(this.userLocationGraphic);
                var that = this;
                setTimeout(function () {
                    that.locationGraohicsLayer.clear();
                }, 10000);
            },
            initToggleBaseMap: function (BaseMaps) {
                this.toggleBaseMapDomNode = document.createElement('div');
                this.toggleBaseMapDomNode.className = 'baseMapToggle';
               
                this.domNode.appendChild(this.toggleBaseMapDomNode);
                for (var i = 0; i < BaseMaps.length; i++) {
                    var BaseMapItemElememt = document.createElement('div');
                    //BaseMapItemElememt.innerHTML = BaseMaps[i].Name;
                    BaseMapItemElememt.layer = BaseMaps[i];
                    BaseMapItemElememt.className = 'toggleMap';
                    BaseMapItemElememt.style.display = BaseMaps[i].visible ? 'none' : '';
                    _thisMapNav = this;

                    ElementMap = new Map(BaseMapItemElememt, {
                        extent: this.AppMap.extent,
                        logo:false,
                        slider: false,
                        isMapNavigation:false
                    });

                    ElementMap.setMapCursor("pointer");


                    var layer = OutageAppHelper.iterationCopy(BaseMaps[i]);
                    
                    this.AddLayers([{ URL: BaseMaps[i].url, ID: BaseMaps[i].id, visible: true, Type:"tiled" }], ElementMap);
                    this.Maps_toggleBaseMap.push(ElementMap);

                    BaseMapItemElememt.onclick = function () {
                        BaseMapElements = _thisMapNav.toggleBaseMapDomNode.children;
                        for (var j = 0; j < BaseMapElements.length; j++) {
                            element = BaseMapElements[j];
                            if (element.style.display == 'none') {
                                element.style.display = '';
                                element.layer.hide();
                            }
                            else {
                                element.style.display = 'none';
                                element.layer.show();
                            }
                        }
                    }
                    this.toggleBaseMapDomNode.appendChild(BaseMapItemElememt);
                }
            }
      });
  }
);


