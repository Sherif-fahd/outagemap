define(["dojo/_base/declare"], function (declare) {
    return declare(null, {
        domNode: null,
        Map:null,
        constructor: function (options)
        {
            this. Map = options.map;
            this.domNode = options.domNode.attributes ? options.domNode : document.getElementById(options.domNode);

            this._initialize(options.settings);
        }
        ,
        _initialize: function (layers) {
            if (this.domNode) {
                var table = document.createElement("table");
                for (var i = 0; i < layers.length; i++) {
                    var layerSettinsg = layers[i];
                    var layerElement = this.createLayerElement(layerSettinsg);
                    table.appendChild(layerElement);
                }
                this.domNode.appendChild(table);
            }
        }
        ,
        createLayerElement: function (layerSettinsg) {
            _LayerListThis = this;
            var tr = document.createElement('tr');
            var tdCheckBox = document.createElement('td');

            var divCheckBox = document.createElement('div');
            divCheckBox.className = "checkBoxPlacer";

            var spanCheckBox = document.createElement('span');
            spanCheckBox.classList.add("toggle-switch");
            if (layerSettinsg.visible)
                spanCheckBox.classList.add("checked");
            spanCheckBox.setAttribute("data-ui-type", "toggle-button");
            spanCheckBox.layerID= layerSettinsg.ID;
            spanCheckBox.onclick = function () { _LayerListThis.toggleLayer(this) };

            var inputCheckBox = document.createElement('input');
            inputCheckBox.type = "checkbox";
            inputCheckBox.checked = "checked";
            inputCheckBox.className = "myInput";

            spanCheckBox.appendChild(inputCheckBox);
            divCheckBox.appendChild(spanCheckBox);
            tdCheckBox.appendChild(divCheckBox);
            tr.appendChild(tdCheckBox);

            var tdLabel = document.createElement('td');
            var divLabel = document.createElement('div');
            divLabel.innerHTML = layerSettinsg.Label;

            tdLabel.appendChild(divLabel);
            tr.appendChild(tdLabel);

            return tr;
        }
        ,
        toggleLayer: function (item) {
            var layer = null;
            if (item.layerID)
                layer = this.Map.getLayer(item.layerID);
            var checkBox = item.children[0];

            var target = checkBox;
            var pTarget = item;

            if (checkBox.checked) {
                target.classList.remove("checked");
                pTarget.classList.remove("checked");
                if (layer)
                    layer.hide();
            } else {
                target.classList.add("checked");
                pTarget.classList.add("checked");
                if (layer)
                    layer.show();
            }
            checkBox.checked = !checkBox.checked;
        }
    });
});

