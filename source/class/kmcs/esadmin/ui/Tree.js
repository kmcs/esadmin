/**
 * The connection tree widget.
 */
qx.Class.define("kmcs.esadmin.ui.Tree", {
    extend: qx.ui.tree.Tree,
    construct: function () {
        this.base(arguments);
        this._initComponents();
    },
    events: {
        /**
         * Event if a was table opened.
         * Data:
         * <ul>
         *  <li><pre>url</pre>: Complete ElasticSearch url, e.g. http://localhost:9200</li>
         *  <li><pre>index</pre>: Name of the ElasticSearch index</li>
         *  <li><pre>type</pre>: Name of the ElasticSearch type</li>
         *  </li><pre>properties</pre>: The ElasticSearch mapping data</li>
         * </ul>
         */
        'openTable': 'qx.event.type.Data'
    },
    members: {
        /**
         * Initial widget code.
         * @returns {void}
         */
        _initComponents: function () {
            this.addListener('dbltap', function (e) {
                var node = e.getTarget();
                if (node instanceof kmcs.esadmin.ui.tree.TypeItem) {
                    var data = {};
                    var connection = node.getParent().getParent();
                    data['url'] = 'http://' + connection.getHost() + ':' + connection.getPort();
                    data['index'] = node.getParent().getName();
                    data['type'] = node.getName();
                    data['properties'] = node.getProperties();
                    this.fireDataEvent('openTable', data);
                }
            });
        }
    }

});
