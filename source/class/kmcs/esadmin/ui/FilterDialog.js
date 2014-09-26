/**
 * Filter dialog to filter the table.
 */
qx.Class.define("kmcs.esadmin.ui.FilterDialog", {
    extend: qx.ui.window.Window,
    construct: function () {
        this.base(arguments, this.tr("Filterung"));
        this._initComponents();
    },
    properties: {
        /**
         * List of fields to be able to filter.
         */
        fieldList: {
            apply: '_applyFieldList'
        }
    },
    events: {
        'applyFilter': 'qx.event.type.Data'
    },
    members: {
        /**
         * create initial widget structure.
         * @returns {void}
         */
        _initComponents: function () {
            this.setLayout(new qx.ui.layout.VBox(5));
            this.setWidth(800);
            this.setHeight(600);
            this.setShowMinimize(false);
            var toolbar = new qx.ui.toolbar.ToolBar();
            this.add(toolbar);
            var part = new qx.ui.toolbar.Part();
            toolbar.add(part);
            var btNewFilter = new qx.ui.toolbar.Button(this.tr("Filter hinzufügen"));
            btNewFilter.addListener('execute', this.__addFilterLine, this);
            part.add(btNewFilter);

            this.__filterBox = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
            this.add(this.__filterBox, {'flex': 1});

            var bar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5).set({'alignX': 'right'}));
            this.add(bar);
            var btAccept = new qx.ui.form.Button(this.tr("übernehmen"));
            btAccept.addListener('execute', function () {
                this.fireDataEvent('applyFilter', this.__filterBox.getChildren().map(function (line) {
                    var items = line.getChildren();
                    return({
                        'field': items[1].getSelection().getItem(0),
                        'type': items[2].getSelection().getItem(0),
                        'value': items[3].getValue()
                    });
                }));
                this.close();
            }, this);
            bar.add(btAccept);
            var btCancel = new qx.ui.form.Button(this.tr("abbrechen"));
            btCancel.addListener('execute', this.close, this);
            bar.add(btCancel);

            this.__modelFieldList = new qx.data.Array();
            this.__modelFilterType = new qx.data.Array(['term', 'match', 'regexp', 'prefix', 'query_string', 'wildcard']);
        },
        /**
         * Apply field list to the field list model.
         * @param value {Map}
         * @returns {void}
         */
        _applyFieldList: function (value) {
            var args = value;
            args.unshift(this.__modelFieldList.getLength());
            args.unshift(0);
            this.__modelFieldList.splice.apply(this.__modelFieldList, args);
        },
        /**
         * On filter row remove.
         * @param e {qx.event.type.Tap}
         * @returns {void}
         */
        _onRemoveLine: function (e) {
            var bt = e.getTarget(),
                line = bt.getLayoutParent();
            this.__filterBox.remove(line);
        },
        /**
         * Add new filter line to the dialog.
         * @returns {void}
         */
        __addFilterLine: function () {
            var line = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
            var btRemove = new qx.ui.form.Button(this.tr("entfernen"));
            btRemove.addListener('execute', this._onRemoveLine, this);
            line.add(btRemove);

            var selectField = new qx.ui.form.VirtualSelectBox(this.__modelFieldList);
            line.add(selectField, {'flex': 1});

            var selectType = new qx.ui.form.VirtualSelectBox(this.__modelFilterType);
            line.add(selectType);

            var filterValue = new qx.ui.form.TextField();
            line.add(filterValue, {'flex': 3});

            this.__filterBox.add(line);
        }
    }

});
