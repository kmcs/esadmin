/**
 * The table tab widget, which renders one table with the es data from one index and type.
 * @asset(qx/icon/Tango/16/actions/view-refresh.png)
 */
qx.Class.define("kmcs.esadmin.ui.TableTab", {
    extend: qx.ui.tabview.Page,
    construct: function (name, url, index, type, properties) {
        this.base(arguments, "" + name);

        this.setUrl(url);
        this.setIndex(index);
        this.setType(type);
        this.setProperties(properties);
        this._initComponents();
        this.initShowCloseButton();

    },
    properties: {
        /**
         * url to elasticsearch host
         */
        url: {
            event: 'changeUrl'
        },
        /**
         * index name
         */
        index: {
            event: 'changeIndex'
        },
        /**
         * type name
         */
        type: {
            event: 'changeType'
        },
        /**
         * type mapping properties
         */
        properties: {
            event: 'changeProperties'
        },
        showCloseButton: {
            init: true,
            refine: true
        }
    },
    members: {
        /**
         * create widget with toolbar and table.
         * @returns {void}
         */
        _initComponents: function () {
            this.setLayout(new qx.ui.layout.VBox());


            this.toolBar = new qx.ui.toolbar.ToolBar();

            var toolbarPartAll = new qx.ui.toolbar.Part();
            this.toolBar.add(toolbarPartAll);

            var btRefresh = new qx.ui.toolbar.Button(this.tr("Aktualisieren"), 'icon/16/actions/view-refresh.png');
            btRefresh.addListener('execute', function () {
                this.model.reloadData();
            }, this);
            toolbarPartAll.add(btRefresh);

            var btFilter = new qx.ui.toolbar.Button(this.tr("Filtern"));
            btFilter.addListener('execute', function () {
                if (!this.__filterDialog) {
                    this.__filterDialog = new kmcs.esadmin.ui.FilterDialog();
                    this.__filterDialog.setFieldList(this.model.getFields());
                    this.__filterDialog.addListener('applyFilter', this._onApplyFilter, this);
                }
                this.__filterDialog.open();
                this.__filterDialog.center();
            }, this);

            toolbarPartAll.add(btFilter);

            this.add(this.toolBar);


            this.model = new kmcs.esadmin.ui.table.Model();

            this.bind('url', this.model, 'url');
            this.bind('index', this.model, 'index');
            this.bind('type', this.model, 'type');


            this.leafs = this.__getObjectLeafs(this.getProperties(), '', {'_id': {'type': 'string'}});

            var fieldList = Object.keys(this.leafs);

            this.model.setColumns(fieldList, fieldList);
            this.model.setFields(fieldList.slice(0));
            this.model.setEditable(true);
            this.model.setColumnEditable(0, false);

            this.table = new qx.ui.table.Table(this.model);
            this.table.addListener('dataEdited', this._onDataEdited, this);
            this.add(this.table, {'flex': 1});

            var renderBoolean = new qx.ui.table.cellrenderer.Boolean(),
                editBoolean = new qx.ui.table.celleditor.CheckBox();
            var table = this.table;

            var self = this;
            fieldList.forEach(function (name, index) {
                if (self.leafs[name].type === 'boolean') {
                    table.getTableColumnModel().setDataCellRenderer(index, renderBoolean);
                    table.getTableColumnModel().setCellEditorFactory(index, editBoolean);
                }
            });
        },
        
        /**
         * Apply filter to table model.
         * @param e {qx.event.type.Data}
         * @returns {undefined}
         */
        _onApplyFilter: function (e) {
            this.model.setFilter(e.getData());
        },
        
        /**
         * After data was entered, update the document on elasticsearch.
         * @param e {qx.event.type.Data}
         * @returns {void}
         */
        _onDataEdited: function (e) {
            var data = e.getData();
            var row = this.model.getRowData(data.row);
            var doc = {}, mapDoc, map;
            var mapping = this.model.getColumnId(data.col).split(/\./);
            mapDoc = doc;
            while (mapping.length > 0 && typeof (map = mapping.shift()) !== 'undefined') {
                mapDoc[map] = {};
                if (mapping.length > 0) {
                    mapDoc = mapDoc[map];
                }
            }
            mapDoc[map] = data.value;
            var req = new qx.io.request.Xhr(this.getUrl() + '/' + this.getIndex() + '/' + this.getType() + '/' + row._id + '/_update');
            req.setMethod('POST');
            req.setAccept('application/json; charset=UTF-8');
            req.setRequestData(qx.lang.Json.stringify({'doc': doc}));
            req.addListener('success', function (e) {
                if (e.getTarget().getResponse().ok !== true) {
                    throw new Error('Update fails! Is _source disabled?');
                }
            }, this);
            req.send();
        },
        /**
         * creates a flat map from mapping properties
         * @param obj {Object}
         * @param prefix {String} prefix for map key
         * @param items {Map} initial map
         * @returns {Map}
         */
        __getObjectLeafs: function (obj, prefix, items) {
            for (var name in obj) {
                if (qx.lang.Type.isObject(obj[name]) && qx.lang.Type.isObject(obj[name].properties)) {
                    this.__getObjectLeafs(obj[name].properties, prefix + name + '.', items);
                } else {
                    items[prefix + name] = obj[name];
                }
            }
            return(items);
        }
    },
    destruct: function () {
        this._disposeObjects('table', 'model');
    }
});
