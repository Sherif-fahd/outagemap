define(["dojo/_base/declare",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
         "dojo/_base/connect",
        "esri/request"
], function (declare, _query, QueryTask, connect,esriRequest) {
        return declare(null, {
            options: {
                powerOutagesDS: {
                    url: "https://giswebextstg.adweag.ae/adweaarcgisext/rest/services/Outage/Power_Outage/MapServer/0",
                    displayedFields: [
                        {
                            name: "STATUS", alias: "Status", formatter: function (item) {
                                var status = item.toLowerCase().indexOf('pending') == -1 ? "Restored" : "Pending";
                                //OutageStatusIcon.src = STATUS == "Restored" ? "Imges/MapSymbols/Restored.png" : "Imges/MapSymbols/Pending.png";
                                return status;
                            }
                        },
                        {
                            name: "ESTIMATEDRESTORETIME", alias: "Restore Time", formatter: function (item) {
                                var h = new Date(item).getHours();
                                var m = new Date(item).getMinutes();
                                h = (h < 10) ? '0' + h : h;
                                m = (m < 10) ? '0' + m : m;
                                var restoreTime = h + ':' + m;
                                return restoreTime;
                            }
                        },
                        { name: "OUTAGE_DURATION", alias: "Duration" },
                        { name: "AFFECTED_CUSTOMERS", alias: "Customers #" },
                        { name: "REGIONID", alias: "Region" },
                        {
                            name: "AREAID", alias: "Area", /*formatter: function (item) {
                                var value =  item.charAt(0).toUpperCase() + item.toLowerCase().slice(1);
                                return value;
                            }*/
                        },
                        { name: "SECTOR_NO", alias: "Sector" },
                        { name: "PLOT_NO", alias: "Plot" },
                    ]
                    ,
                    searchFields: ["REGIONID", "AREAID", "SECTOR_NO", "STATUS"],
                },
                Initialized:false,
                waterOutagesDS: {
                    url: "https://giswebextstg.adweag.ae/adweaarcgisext/rest/services/Outage/Water_Outage/MapServer/0"
                },
                pageSize: 24
         }
        ,
        powerOutagesMainDS: [],
        powerOutagesPageDS:[],
        powerOutagesCurrentPageIndex:1,
        powerOutagesPageCount:0,
        constructor: function (options, domNode) {
            declare.safeMixin(this.options, options);
            if (domNode)
                this.domNode = domNode.attributes ? domNode : document.getElementById(domNode);
            else
                this.domNode = document.createElement('div');
            //
            this._initSearchBox();
            this._initSearch();
        }
        ,
        _initSearch: function (searchValue) {
            this.powerOutagesGridDomeNode = document.createElement('div');
            
            //
            var condition = "1=1";
            if (searchValue) {
                if (this.options.powerOutagesDS.searchFields) {
                    for (var i = 0  ; i < this.options.powerOutagesDS.searchFields.length; i++) {
                        searchField = this.options.powerOutagesDS.searchFields[i];
                        if (i > 0)
                            condition += "OR LOWER(" + searchField + ") like '%" + searchValue.toLowerCase() + "%'";
                        else
                            condition = "LOWER(" + searchField + ") like '%" + searchValue.toLowerCase() + "%'";
                    }
                }
            }
            _thisSearchOutages = this;
            if (this.options && this.options.powerOutagesDS) {
                var layersRequest = esriRequest({
                    url: this.options.powerOutagesDS.url + "/query",
                    content: {
                        where: condition,
                        returnIdsOnly: true,
                        f: "json"
                    },
                    handleAs: "json",
                    callbackParamName: "callback"
                });
                layersRequest.then(
                  function (result) {
                      if (result.objectIds && result.objectIds.length > 0) {
                          _thisSearchOutages.powerOutagesMainDS = result.objectIds;
                          resultCount = _thisSearchOutages.powerOutagesMainDS.length;
                          _thisSearchOutages.powerOutagesPageCount = Math.ceil(resultCount / _thisSearchOutages.options.pageSize);
                          _thisSearchOutages._loadPoweOutageCurrentPage();
                          if (!_thisSearchOutages.Initialized) {
                              _thisSearchOutages._createPowerOutagePager();
                              _thisSearchOutages.Initialized = true;
                          }
                          else {
                              _thisSearchOutages._bindpager();
                          }
                      }
                      else {
                          connect.publish("ShowNoticiation", { message: "No Matching Result Found..",autoHide:true});
                      }
                  }, function (error) {
                      console.log("Error: ", error.message);
                  });
                //
                //queryTask = new QueryTask(this.options.powerOutagesDS.url);
                //queryTask.execute(query, function (result) {
                //    _thisSearchOutages.powerOutagesMainDS = result.features;
                //    _thisSearchOutages.powerOutagesPageCount = Math.ceil(_thisSearchOutages.powerOutagesMainDS / _thisSearchOutages.options.pageSize);
                //    _thisSearchOutages._loadPoweOutageCurrentPage();
                //}, function (error) { });
            }
            }
            ,
            _initSearchBox: function () {
                _thisSearchOutages = this;
                var textBox = document.createElement('input');
                textBox.type = "text";
                textBox.className = 'searchBox';
                textBox.onkeyup = function () {
                    if (this.value == "") {
                        _thisSearchOutages._initSearch();
                    }
                    else if (this.value && this.value.length > 2)
                        _thisSearchOutages._initSearch(this.value);
                }
                textBox.placeholder = "Search for outages...";
                textBox.title = "Type in region or area or sector/ or filter by status";
                this.domNode.parentElement.insertBefore(textBox, this.domNode.parentElement.children[1]);
            }
        ,
        _loadPoweOutageCurrentPage: function () {
            var currntPageIDs = [];
            if (this.powerOutagesMainDS && this.powerOutagesMainDS.length > 0) {
                if (this.powerOutagesMainDS.length > this.options.pageSize) {
                    var startIndex = (this.powerOutagesCurrentPageIndex-1) * this.options.pageSize;
                    var endIndex = startIndex + this.options.pageSize;
                    currntPageIDs = this.powerOutagesMainDS.slice(startIndex, endIndex);
                }
                else {
                    currntPageIDs = this.powerOutagesMainDS;
                }
                query = new _query();
                query.where = "1=1";
                query.objectIds = currntPageIDs;
                query.outFields = ["*"];
                /*query.returnGeometry = true;*/
                queryTask = new QueryTask(this.options.powerOutagesDS.url);
                queryTask.execute(query, function (result) {
                    _thisSearchOutages.powerOutagesPageDS = result.features;
                    _thisSearchOutages._BindPowerOutage(_thisSearchOutages.powerOutagesPageDS);
                }, function (error) { });
            }
        },
        _BindPowerOutage: function (DataSource) {
                this._resetGrid();
                var tb = document.createElement('table');
                tb.className = 'tbGrid';

                var trHeader = document.createElement('tr');
                trHeader.className = 'header';

                var width = 100 / this.options.powerOutagesDS.displayedFields.length;

                for (var i = 0; i < this.options.powerOutagesDS.displayedFields.length; i++) {
                    var th = document.createElement('th');
                    th.width = width + "%";
                    th.innerHTML = this.options.powerOutagesDS.displayedFields[i].alias;
                    trHeader.appendChild(th);
                }
                tb.appendChild(trHeader);
                for (var j = 0; j < DataSource.length; j++) {
                    var item = DataSource[j];
                    var trRow = document.createElement('tr');

                    for (var k = 0; k < this.options.powerOutagesDS.displayedFields.length; k++) {
                        var field = this.options.powerOutagesDS.displayedFields[k];
                        var td = document.createElement('td');
                        var value = item.attributes[field.name]
                        if (field.formatter) {
                            value = field.formatter(value);
                        }
                        td.innerHTML = value;
                        trRow.rowItem = item;
                        trRow.appendChild(td);
                        trRow.title = "Click to view outage details..";
                    }
                    trRow.onclick = function () {
                        connect.publish("populateOutageDetailsPanel", { outageFeature: this.rowItem,zoomtoOutage:true });
                    }
                    tb.appendChild(trRow);
                }

                this.powerOutagesGridDomeNode.appendChild(tb);
                this.domNode.appendChild(this.powerOutagesGridDomeNode);
        },
        _bindpager: function () {
            this.powerOutagesPageCounterDIv.innerHTML = this.powerOutagesCurrentPageIndex;
            this.powerOutagesPageCountDIv.innerHTML = this.powerOutagesPageCount;
        }
        ,_createPowerOutagePager: function () {
                _thisSearchOutages = this;
                var pager = document.createElement('div');
                pager.className = 'pagination';

                var prevPager = document.createElement('a');
                prevPager.href = "#";
                prevPager.innerHTML = "&laquo;";
                prevPager.onclick = function () {
                    if (_thisSearchOutages.powerOutagesCurrentPageIndex > 1)
                        _thisSearchOutages.powerOutagesCurrentPageIndex = _thisSearchOutages.powerOutagesCurrentPageIndex - 1;
                    _thisSearchOutages.powerOutagesPageCounterDIv.innerHTML = _thisSearchOutages.powerOutagesCurrentPageIndex;
                    _thisSearchOutages._loadPoweOutageCurrentPage();
                }


                var pageCounterDiv = document.createElement('div');
                pageCounterDiv.className = 'pageCounter';
                pageCounterDiv.innerHTML = "1";


                this.powerOutagesPageCounterDIv = pageCounterDiv;

                var divSeprator = document.createElement('div');
                divSeprator.innerHTML = "/";
                var pageTotalDiv = document.createElement('div');
                pageTotalDiv.innerHTML = this.powerOutagesPageCount;
                this.powerOutagesPageCountDIv = pageTotalDiv;

                var pageCounter = document.createElement('a');
                pageCounter.className = 'active';
                pageCounter.href = "#";
                pageCounter.appendChild(pageCounterDiv);
                pageCounter.appendChild(divSeprator);
                pageCounter.appendChild(pageTotalDiv);

                var nextPager = document.createElement('a');
                nextPager.href = "#";
                nextPager.onclick = function () {
                    if (_thisSearchOutages.powerOutagesCurrentPageIndex < _thisSearchOutages.powerOutagesPageCount)
                        _thisSearchOutages.powerOutagesCurrentPageIndex = _thisSearchOutages.powerOutagesCurrentPageIndex + 1;
                    _thisSearchOutages.powerOutagesPageCounterDIv.innerHTML = _thisSearchOutages.powerOutagesCurrentPageIndex;
                    _thisSearchOutages._loadPoweOutageCurrentPage();
                }

                nextPager.innerHTML = "&raquo;";

                pager.appendChild(prevPager);
                pager.appendChild(pageCounter);
                pager.appendChild(nextPager);

                this.pager = pager;
                this.domNode.parentElement.insertBefore(this.pager, this.domNode.parentElement.children[1]);
            },
        _resetGrid: function () {
            this.domNode.innerHTML = "";
            this.powerOutagesGridDomeNode.innerHTML = "";
        }
    });
});