define(["dojo/_base/declare",
        "esri/tasks/query", 
        "esri/tasks/QueryTask"], 
        function (declare,_query,QueryTask) {
            return declare(null, {
                map:null,
                domNode: null,
                regionsDS: null,
                areasDS:null,
                sectorDS: null,
                plotDS:null,
                options: {
                    returnGeometry: true,
                    region: {
                        fieldName: "REGIONNAME",
                        outFileds: ["REGIONNAME", "REGIONCODE"],
                        URL: "https://giswebextstg.adweag.ae/adweaarcgisext/rest/services/ADWEA/Landbase/MapServer/10"
                    }
                    ,
                    area: {
                        fieldName: "AREANAME",
                        relatedField: "REGIONNAME",
                        outFileds: ["AREANAME", "NAMEARABIC", "AREACODE", "REGIONNAME", "REGIONCODE"],
                        URL: "https://giswebextstg.adweag.ae/adweaarcgisext/rest/services/ADWEA/Landbase/MapServer/9"
                    }
                    ,
                    sector: {
                        fieldName: "NAME",
                        relatedField: "AREACODE",
                        outFileds: ["DIVISIONID", "NAME", "AREACODE"],
                        URL: "https://giswebextstg.adweag.ae/adweaarcgisext/rest/services/ADWEA/Landbase/MapServer/8"
                    },
                    plot: {
                        fieldName: "PLOTID",
                        relatedField: "DIVISION_NAME",
                        outFileds: ["PLOTID", "DIVISION_NAME", "AREA_NAME", "REGION_NAME", "REGIONNAME", "REGIONCODE"],
                        URL: "https://giswebextstg.adweag.ae/adweaarcgisext/rest/services/ADWEA/Landbase/MapServer/6"
                    }
                },
                constructor: function (settings) {
                    declare.safeMixin(this.options, settings.options);
                    this.map = settings.map;
                    this._initialize();
                    console.log("return geometry value after MIXIN "+ this.options.returnGeometry);
                }
                ,
                _initialize: function () {
                    this.domNode = document.createElement('div');
                    this._loadData();
                }
                ,
                _loadData: function () {
                    this._loadRegions();
                },
                _loadRegions: function () {
                    _LBLocator = this;
                    if (this.options && this.options.region) {
                        URL = this.options.region.URL;
                        outFileds =this.options.region.outFileds;
                       
                        var query = new _query();
                        var queryTask = new QueryTask(URL);

                        query.returnGeometry = this.options.returnGeometry;
                        query.where = '1=1';
                        query.outSpatialReference = this.map.spatialReference;
                        query.outFields = outFileds;
                        queryTask.execute(query, function (result) {
                            console.log("Regions Loaded");
                            console.log(result);
                            _LBLocator.regionsDS = result.features;
                            _LBLocator._loadAreas(_LBLocator.regionsDS[3]);
                        }, function (error) { });
                    }
                },
                _loadAreas: function (region) {
                    _LBLocator = this;
                    if (this.options && this.options.area) {
                        URL = this.options.area.URL;
                        outFileds = this.options.area.outFileds;

                        var query = new _query();
                        var queryTask = new QueryTask(URL);

                        query.returnGeometry = this.options.returnGeometry;
                        query.where = '1=1'

                        if (region && region.attributes[this.options.area.relatedField]) {
                            query.where = "" + this.options.area.relatedField + " = '" + region.attributes[this.options.area.relatedField]+"'";
                        }
                        //
                        query.outSpatialReference = this.map.spatialReference;
                        query.outFields = outFileds;
                        queryTask.execute(query, function (result) {
                            console.log("Sector Loaded");
                            console.log(result);
                            _LBLocator.areasDS = result.features;
                            _LBLocator._loadSectors(_LBLocator.areasDS[0]);
                        }, function (error) { });
                    }
                },
                _loadSectors: function (area) {
                    _LBLocator = this;
                    if (this.options && this.options.sector) {
                        URL = this.options.sector.URL;
                        outFileds = this.options.sector.outFileds;

                        var query = new _query();
                        var queryTask = new QueryTask(URL);

                        query.returnGeometry = this.options.returnGeometry;
                        query.where = '1=1'
                        if (area && area.attributes[this.options.sector.relatedField]) {
                            query.where = "" + this.options.sector.relatedField + " = '" + area.attributes[this.options.sector.relatedField]+"'";
                        }

                        query.outSpatialReference = this.map.spatialReference;
                        query.outFields = outFileds;
                        queryTask.execute(query, function (result) {
                            console.log("area Loaded");
                            console.log(result);
                            _LBLocator.sectorDS = result.features;
                            _LBLocator._loadPlots(_LBLocator.sectorDS[0]);
                        }, function (error) { });
                    }
                },
                _loadPlots: function (sector) {
                    _LBLocator = this;
                    if (this.options && this.options.plot) {
                        URL = this.options.plot.URL;
                        outFileds = this.options.plot.outFileds;

                        var query = new _query();
                        var queryTask = new QueryTask(URL);

                        query.returnGeometry = this.options.returnGeometry;
                        query.where = '1=1'
                        if (sector && sector.attributes[this.options.plot.relatedField]) {
                            query.where = "" + this.options.plot.relatedField + " = '" + sector.attributes[this.options.plot.relatedField]+"'";
                        }
                        query.outSpatialReference = this.map.spatialReference;
                        query.outFields = outFileds;
                        queryTask.execute(query, function (result) {
                            console.log("Plots Loaded");
                            console.log(result);
                            _LBLocator.plotDS = result.features;
                        }, function (error) { });
                    }
                },

            });
});