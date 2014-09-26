/**
 * Tree item for ElasticSearch host connection.
 */
qx.Class.define("kmcs.esadmin.ui.tree.ConnectionItem", {
    extend: qx.ui.tree.TreeFolder,
    construct: function (connectionName) {
        this.base(arguments, connectionName);
        this._initComponents();
    },
    properties: {
        appearance: {
            refine: true,
            init: "tree-item-connection"
        },
        openSymbolMode: {
            refine: true,
            init: 'always'
        },
        childrenInitialLoaded: {
            check: 'Boolean',
            init: false
        },
        host: {
            init: 'localhost',
            apply: '_updateBaseUrl'
        },
        port: {
            init: 9200,
            apply: '_updateBaseUrl'
        }
    },
    members: {
        /**
         * Initial widget stuff.
         * @returns {void}
         */
        _initComponents: function () {

            this.__indexItemByName = {};
            this.__baseUrl = 'http://' + this.getHost() + ':' + this.getPort() + '/';

            this.addListenerOnce('changeOpen', function () {
                if (!this.isChildrenInitialLoaded()) {
                    this._loadIndicesList();
                    this.setChildrenInitialLoaded(true);
                }
            });
        },
        
        /**
         * loads the inidices and types.
         * @returns {void}
         */
        _loadIndicesList: function () {
            var req = new qx.io.request.Xhr(this.__baseUrl + '_cluster/state');
            req.setMethod('GET');
            req.setAccept('application/json; charset=UTF-8');
            req.addListener('success', this._updateIndicesList, this);
            req.send();
        },
        /**
         * Apply host and port to internal base url.
         * @returns {void}
         */
        _updateBaseUrl: function () {
            this.__baseUrl = 'http://' + this.getHost() + ':' + this.getPort() + '/';
        },
        /**
         * On indices service request succes.
         * @param e {qx.event.type.Dom}
         * @returns {void}
         */
        _updateIndicesList: function (e) {
            var data = e.getTarget().getResponse();
            var loadedIndices = Object.keys(this.__indexItemByName);

            for (var indexName in data.metadata.indices) {
                if (!this.__indexItemByName[indexName]) {
                    this.__indexItemByName[indexName] = new kmcs.esadmin.ui.tree.IndexItem(indexName);
                    this.add(this.__indexItemByName[indexName]);
                } else {
                    loadedIndices.splice(loadedIndices.indexOf(indexName), 1);
                }

                var loadedTypeList = this.__indexItemByName[indexName].getLoadedTypeList();
                for (var typeName in data.metadata.indices[indexName].mappings) {
                    if (!this.__indexItemByName[indexName].addType(typeName, data.metadata.indices[indexName].mappings[typeName].properties)) {
                        loadedTypeList.splice(loadedTypeList.indexOf(typeName), 1);
                    }
                }
                loadedTypeList.forEach(function (value) {
                    this.__indexItemByName[indexName].removeType(value);
                });
            }

            loadedIndices.forEach(function (value) {
                this.remove(this.__indexItemByName[value]);
            });
        }
    }

});
