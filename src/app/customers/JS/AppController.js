define(["dojo/_base/declare", 'dojo/_base/Color', "OutageApp/MapNavigation", "OutageApp/Notfifcations", "OutageApp/LayerList", "OutageApp/LandBaseLocator"
        , "OutageApp/SearchOutages"
    , "dojo/_base/connect", "esri/tasks/query", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/tasks/geometry", "esri/layers/GraphicsLayer",
    "esri/geometry/geometryEngineAsync"
], function (declare, Color, MapNavigation, Notfifcations, LayerList, LandBaseLocator, SearchOutages, Connect, Query, FeatureLayer, GraphicsLayer, tasksGeometry, GraphicsLayer, geometryEngineAsync) {
    return declare(null, {
        Notfifcations: null,
        MapNavigation: null,
        OutageSearchForm: null,
        OutageDetailsPanel: null,
        outageSearchBuffer: null,
        layerListForm: null,
        LayerList:null,
        bufferGL: null,
        searchOutages:null,
        bufferSymbol:new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,new esri.symbol.SimpleLineSymbol(
                         esri.symbol.SimpleLineSymbol.STYLE_SOLID,new dojo.Color([255,255, 255, 0.5]), 15),
                         new dojo.Color([0, 0, 0, 0.5]))
        ,
        HighlightOutagesGL: null,
        HighLightOutageSymbol: new esri.symbol.SimpleMarkerSymbol('circle', 30,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new Color([148, 0, 211, 0.25]), 15),
            new Color([148, 0, 211, 0.5]))
        ,
        constructor: function () {
            this.Notfifcations = new Notfifcations({ ContainerDiv: "noticicationDiv" });

            this.MapNavigation = new MapNavigation({ mapDiv: "map" });

            this.OutageSearchForm = document.getElementById('OutageSearchForm');
            this.OutageDetailsPanel = document.getElementById('OutageInfoPanel');
            this.layerListForm = document.getElementById('LayerList');

            this.bufferGL = new GraphicsLayer({ id: "searchBufferGraphicsLayer" });
            this.MapNavigation.AppMap.addLayer(this.bufferGL);

            this.searchOutages = new SearchOutages(null, "OutageSearchFormContent");
            //
            //var x = new LandBaseLocator({ options: configuration.LandBaseLocator, map: this.MapNavigation.AppMap });
            //
            this.HighlightOutagesGL = new GraphicsLayer({ id: "HighlightOutagesGL" });
            this.MapNavigation.AppMap.addLayer(this.HighlightOutagesGL);

            this.LayerList - new LayerList({
                map: this.MapNavigation.AppMap,
                domNode: this.layerListForm,
                settings: configuration.OutagesLayers
            });
            this.initListners();
        }
        ,
        initListners: function () {
            _this = this;
            Connect.subscribe("AppMapLoaded", function () {
                document.getElementById('mainLocadingDiv').style.display = 'none';
            });

            Connect.subscribe("searchOutagesByBuffer", function (Location) {
                _this.searchOutagesInUserArea(Location.location);
            });


            Connect.subscribe("ShowNoticiation", function (notification) {
                _this.Notfifcations.showNotifiation(notification.message);
                if (notification.autoHide)
                    setTimeout(function () { _this.Notfifcations.hide(); }, 4000);
            });


            Connect.subscribe("hideNotification", function () {
                _this.Notfifcations.hide();
            });

            Connect.subscribe("populateOutageDetailsPanel", function (outageInfo) {
                _this.showOutagesLoading();
                _this.bindOtagePanel(outageInfo.outageFeature);
                _this.MapNavigation.toggleBaseMapDomNode.classList.add("Shifted");
                if (outageInfo.zoomtoOutage) {
                    _this.zoomToOutage(outageInfo.outageFeature);
                }
                else {
                    _this.HighLightOutage(outageInfo.outageFeature.geometry);
                    _this.hideOutagesLoading();
                }
                _this.hideSearchOutageForm()
            })
        },
        pausecomp: function (millis) {
            var date = new Date();
            var curDate = null;
            do { curDate = new Date(); }
            while (curDate - date < millis);
        },
        showOutagesLoading: function () {
            var loadingOutageDetails = document.getElementsByClassName("loadingOutageDetails")[0];
            var OutagePanelHeader = document.getElementsByClassName("OutagePanelHeader")[0];
            var OutagePanelContent = document.getElementsByClassName("OutagePanelContent")[0];
            if (loadingOutageDetails)
                loadingOutageDetails.style.display = 'block';
            if (OutagePanelHeader)
                OutagePanelHeader.style.display = 'none';
            if (OutagePanelContent)
                OutagePanelContent.style.display = 'none';
        },
        hideOutagesLoading: function () {
            setTimeout(function () {
                var loadingOutageDetails = document.getElementsByClassName("loadingOutageDetails")[0];
                var OutagePanelHeader = document.getElementsByClassName("OutagePanelHeader")[0];
                var OutagePanelContent = document.getElementsByClassName("OutagePanelContent")[0];
                if (loadingOutageDetails)
                    loadingOutageDetails.style.display = 'none';
                if (OutagePanelHeader)
                    OutagePanelHeader.style.display = 'block';
                if (OutagePanelContent)
                    OutagePanelContent.style.display = 'block';
            },700);
        },
        zoomToOutage: function (feature) {
            _this = this;
            if (feature) {
                if (feature.geometry) {
                    this.ZoomAndHighlightOutage(feature.geometry);
                }
                else {
                    OID = feature.attributes.OBJECTID;
                    var query = new Query();
                    query.objectIds = [OID];
                    this.MapNavigation.PowerOutagesFL.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (result) {
                        if (result.length > 0) {
                            geometry = result[0].geometry;
                            _this.ZoomAndHighlightOutage(geometry);
                        }
                    }, function () {
                    });
                }
            }
        },
        ZoomAndHighlightOutage: function (geometry) {
            if (geometry) {
                this.HighLightOutage(geometry);
                this.MapNavigation.AppMap.setScale(configuration.zoomScale);//_this.MapNavigation.AppMap.getMaxScale());
                this.MapNavigation.AppMap.centerAt(geometry);
                this.hideOutagesLoading();
            }
        },
        HighLightOutage: function (outageGeometry) {
            if (outageGeometry) {
                _this = this;
                var outageGraphic = new esri.Graphic(outageGeometry, this.HighLightOutageSymbol);

                if (this.HighlightOutagesGL) {
                    this.HighlightOutagesGL.clear();
                    clearTimeout(this.clearOutagesTimer);
                    this.HighlightOutagesGL.add(outageGraphic);                    
                }
                this.clearOutagesTimer = setTimeout(function () {
                    _this.HighlightOutagesGL.clear();
                }, 12000);
            }
        },
        toggleLayerList: function () {
            if (this.layerListForm) {
                if (this.layerListForm.classList.contains('Opened'))
                    this.layerListForm.classList.remove("Opened");
                else 
                    this.layerListForm.classList.add("Opened");
            }
        },
        toggleSearchOutageForm: function () {
            if (this.OutageSearchForm) {
                if (this.OutageSearchForm.className == '')
                    this.showSearchOutageForm();
                else
                    this.hideSearchOutageForm();
            }
        },
        showSearchOutageForm: function () {
            this.OutageSearchForm.className = 'Opened';
        },
        hideSearchOutageForm: function () {
            this.OutageSearchForm.className = ''
        },
        hideOutageDetails: function () {
            if (this.OutageDetailsPanel)
                this.OutageDetailsPanel.style.display = 'none';
            //
            this.MapNavigation.toggleBaseMapDomNode.classList.remove("Shifted");
        },
        bindOtagePanel: function (outageFeature) {
            if (outageFeature) {
                ouategPanel = document.getElementById('OutageInfoPanel');
                OutageStatusIcon = document.getElementById('OutageStatusIcon');

                OutagePanelContent = document.getElementById('OutagePanelContent');

                var h = new Date(outageFeature.attributes['ESTIMATEDRESTORETIME']).getHours();
                var m = new Date(outageFeature.attributes['ESTIMATEDRESTORETIME']).getMinutes();
                h = (h < 10) ? '0' + h : h;
                m = (m < 10) ? '0' + m : m;
                var restoreTime = h + ':' + m;

                var AreaHTML = outageFeature.attributes['REGIONID'] + "<br>";
                AreaHTML += outageFeature.attributes['AREAID'] ? outageFeature.attributes['AREAID'] + "<br>" : "";
                AreaHTML += outageFeature.attributes['SECTOR_NO'] ? outageFeature.attributes['SECTOR_NO'] + "<br>" : "";
                AreaHTML += outageFeature.attributes['PLOT_NO'] ? outageFeature.attributes['PLOT_NO'] + "<br>" : "";

                var STATUS = outageFeature.attributes['STATUS'].toLowerCase().indexOf('pending') == -1 ? "Restored" : "Pending";
                OutageStatusIcon.src = STATUS == "Restored" ? "Imges/MapSymbols/Restored.png" : "Imges/MapSymbols/Pending.png";
                ouategPanel.style.display = 'block';

                OutagePanelContent.innerHTML = "<ul>" +
                    "<li> <h3> Outage Status </h3> <span>" + STATUS + "</span></li>" +
                    "<li> <h3> Outage Location </h3> <span> " + AreaHTML +
                    "</span></li>" +
                    "<li> <h3> Expected Restore Time </h3> <span>" + restoreTime + "</span></li>" +
                    "<li> <h3> Outage Duration </h3> <span>" + outageFeature.attributes['OUTAGE_DURATION'] + "</span></li>" +
                    "<li> <h3> Affected Customers </h3> <span>" + outageFeature.attributes['AFFECTED_CUSTOMERS'] + "</span></li>" +
                    "</ul>";
            }
        }
        ,
        //Query all outages exist in user surronding area , by detecting user location , apply buffer distance and query all outages on his area
        searchOutagesInUserArea: function (userLcation) {
            var query = new Query();
            query.geometry = userLcation.geometry;
            query.distance = 1000;
            this.MapNavigation.PowerOutagesFL.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (result) {
                if (result.length > 0) {
                    var numberOfPowerOutages = result.length;
                    MainController.Notfifcations.showNotifiation("There are <b>( " + numberOfPowerOutages + " )</b> power outages in your area click outage on map to view details");
                    setTimeout(function () { MainController.Notfifcations.hide(); }, 4000)
                }
                else {
                    MainController.Notfifcations.showNotifiation("There are no outages in your area");
                    setTimeout(function () { MainController.Notfifcations.hide(); }, 4000)
                }
            }, function () {
                console.log("Error Applying selection");
            });

            this.bufferGL.clear();
            _this = this;
            geometryEngineAsync.geodesicBuffer(userLcation.geometry, 1000).then(
                function (res) {
                    _this.showBuffer(res)
                }
            );
        }
        ,
        showBuffer: function (geometries) {
            _this = this;
            geometry = geometries;//geometries[0]
            var graphic = new esri.Graphic(geometry, this.bufferSymbol);
            this.bufferGL.add(graphic);
            setTimeout(function () {
                _this.bufferGL.clear();
            }, 4000)
            this.MapNavigation.AppMap.setExtent(geometry.getExtent());
        }
    });
});

var OutageAppHelper= {
    iterationCopy: function (src) {
        let target = {};
        for (let prop in src) {
            if (src.hasOwnProperty(prop)) {
                target[prop] = src[prop];
            }
        }
        return target;
    }
    ,
    CloseParent: function (element) {
        if (element.parentElement)
            element.parentElement.style.display = 'none';
    }
}

