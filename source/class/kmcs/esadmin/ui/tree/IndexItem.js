/**
 * Tree item for ElasticSearch index.
 */
qx.Class.define("kmcs.esadmin.ui.tree.IndexItem", {
    extend: qx.ui.tree.TreeFolder,
    construct: function (indexName) {
        this.base(arguments, indexName);
        this._initComponents();
        this.setName(indexName);
    },
    properties: {
        /**
         * index name
         */
        name: {
            check: 'String'
        }
    },
    members: {
        /**
         * initial widget stuff.
         * @returns {void}
         */
        _initComponents: function () {
            this.__typeItemByName = {};
        },
        
        /**
         * add a type to the index.
         * @param type {String}
         * @param properties {Object} mapping of the type
         * @returns {Boolean}
         */
        addType: function (type, properties) {
            if (!this.__typeItemByName[type]) {
                this.__typeItemByName[type] = new kmcs.esadmin.ui.tree.TypeItem(type, properties);
                this.add(this.__typeItemByName[type]);
                return(true);
            } else {
                this.__typeItemByName[type].setProperties(properties);
            }
            return(false);
        },
        /**
         * remove a type form the index.
         * @param type {String} name of the type
         * @returns {void}
         */
        removeType: function (type) {
            if (this.__typeItemByName[type]) {
                this.remove(this.__typeItemByName[type]);
            }
        },
        /**
         * gives a list of all types.
         * @returns {Array}
         */
        getLoadedTypeList: function () {
            return(Object.keys(this.__typeItemByName));
        }
    }
});