/**
 * the table model to request the data from ElasticSearch host.
 */
qx.Class.define("kmcs.esadmin.ui.table.Model", {
    extend: qx.ui.table.model.Remote,
    construct: function () {
        this.base(arguments);
    },
    properties: {
        /**
         * the base url to the host.
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
         * field map.
         */
        fields: {
        },
        
        /**
         * filter map.
         */
        filter: {
            apply: '_applyFilter',
            init: []
        }

    },
    members: {
        _loadRowCount: function () {
            this.__fetchData(function (e) {
                var request = e.getTarget();
                var response = request.getResponse();
                this._onRowCountLoaded(response.hits.total);
            });
        },
        _loadRowData: function (firstRow, lastRow) {
            this.__fetchData(function (e) {
                var request = e.getTarget();
                var response = request.getResponse();
                this._onRowDataLoaded(response.hits.hits.map(function (item) {
                    item.fields._id = item._id;
                    return(item.fields);
                }));
            }, firstRow, lastRow);
        },
        /**
         * apply filter to model.
         * @returns {void}
         */
        _applyFilter: function () {
            this.reloadData();
        },
        /**
         * load data from ElasticSearch.
         * @param callback {Function}
         * @param firstRow {Integer}
         * @param lastRow {Integer}
         * @returns {void}
         */
        __fetchData: function (callback, firstRow, lastRow) {
            var data = {
                'query': {
                    'bool': {
                        'must': [],
                        'must_not': [],
                        'should': {
                            'match_all': {}
                        }
                    }
                }
            };

            data['fields'] = this.getFields();
            var sortIndex = this.getSortColumnIndex();
            if (data['fields'][sortIndex]) {
                data['sort'] = {};
                data['sort'][data['fields'][sortIndex]] = {'order': this.isSortAscending() ? 'asc' : 'desc'};
            }

            if (typeof (firstRow) === 'number' && typeof (lastRow) === 'number') {
                data['size'] = (lastRow - firstRow) + 1;
                data['from'] = firstRow;
            }

            data['query']['bool']['must'] = this.getFilter().map(function (item) {
                var filter = {};
                filter[item.type] = {};
                filter[item.type][item.field] = item.value;
                return(filter);
            });


            var req = new qx.io.request.Xhr(this.getUrl() + '/' + this.getIndex() + '/' + this.getType() + '/_search');
            req.setMethod('POST');
            req.setAccept('application/json; charset=UTF-8');
            req.setRequestData(qx.lang.Json.stringify(data));
            req.addListener('success', callback, this);
            req.send();
        }
    }
});
