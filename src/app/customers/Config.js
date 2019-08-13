var configuration = {
    getUserLocation: true,
    userLocationScale: 16,
    proxyEnabled: true,
    proxyURL: "https://localhost/Proxy/proxy.ashx",
    outageServicesArcServerURL: "https://giswebextstg.adweag.ae/adweaarcgisext/rest",
    outageSearchBufferDistance: 1000,//Distance in Meter
    zoomScale:2000,
    units: "esriSRUnit_Meter",
    MapNavigation: {
        InitialExtent: {
            "xmin": 5656978.05501637,
            "ymin": 2550326.7580000176,
            "xmax": 6439693.224656536,
            "ymax": 2927619.9296156284,
            "spatialReference": {
                "wkid": 102100, "latestWkid": 3857
            }
        },
        BaseMaps: [
            {
                URL: "https://arcgis.sdi.abudhabi.ae/arcgis/rest/services/Pub/BaseMapEng_LightGray_GCS/MapServer",
                ID: "BaseMapEnglish",
                Type: "tiled",
                visible: true,
                Name: "Map",

            },
            {
                URL: "https://arcgis.sdi.abudhabi.ae/arcgis/rest/services/Pub/IMG_SAT_50CM_GCS/MapServer",
                ID: "BaseMapSatellite1M",
                Type: "tiled",
                visible: false,
                Name: "Satalite",
            }
        ],
    }
    ,
    OutagesLayers: [
            {
                URL: "https://giswebextstg.adweag.ae/adweaarcgisext/rest/services/Outage/Power_Outage/MapServer/0",
                ID: "PowerOutages",
                Type: "dynamic",
                Label: "Power Outages",
                visible: true,
                Renderer: {}
            },
            {
                URL: "https://giswebextstg.adweag.ae/adweaarcgisext/rest/services/Outage/Water_Outage/MapServer/0",
                ID: "WaterOutages",
                Type: "dynamic",
                Label: "Water Outages",
                visible: false,
                Renderer: {}
            }
    ],
    LandBaseLocator: {
        returnGeometry:false,
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
            outFileds: ["PLOTID","DIVISION_NAME", "AREA_NAME", "REGION_NAME"],
            URL: "https://giswebextstg.adweag.ae/adweaarcgisext/rest/services/ADWEA/Landbase/MapServer/6"
        }
    }
}
