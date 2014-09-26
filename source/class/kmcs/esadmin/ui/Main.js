/**
 * Main viewport of the application.
 * @asset(qx/icon/Tango/16/places/network-workgroup.png)
 */
qx.Class.define("kmcs.esadmin.ui.Main", {
    
    extend : qx.ui.container.Composite,
    
    construct : function() {
        this.base(arguments, new qx.ui.layout.VBox());
        
        
        this._initComponents();
        
    },
    
    members : {
        /**
         * create initial widget structure.
         * @returns {void}
         */
        _initComponents : function() {
            
            this.splitpane = new qx.ui.splitpane.Pane('horizontal');
            this.add(this.splitpane, {'flex' : 1});
            
            
            this.tree = new kmcs.esadmin.ui.Tree();
            this.treeRoot = new qx.ui.tree.TreeFolder(this.tr("Verbindungen"));
            this.treeRoot.setOpen(true);
            this.treeRoot.setIcon('icon/16/places/network-workgroup.png');
            this.tree.setRoot(this.treeRoot);
            this.tree.setHideRoot(false);
            
            this.tree.addListener('openTable', this._onOpenDataTable, this);
            
            this.splitpane.add(this.tree, 2);
            
            this.__tabPagesById = {};
            this.tabs = new qx.ui.tabview.TabView();
            
            this.splitpane.add(this.tabs, 4);
            
            this.__setupConnection();
            
        },
        
        /**
         * setup initial connection.
         * @returns {void}
         */
        __setupConnection : function() {
            
            var connections = qx.core.Environment.get("kmcs.esadmin.connections");
            var root = this.treeRoot;
            connections.forEach(function(item) {
                var connection = new kmcs.esadmin.ui.tree.ConnectionItem(item.name);
                connection.setHost(item.host);
                connection.setPort(item.port);
                root.add(connection);
            });
        },
        
        /**
         * On a table open event, create table tab.
         * @param e {qx.event.type.Data}
         * @returns {void}
         */
        _onOpenDataTable : function(e) {
            var data = e.getData(),
                id = data.index + '.' + data.type;
            if(this.__tabPagesById[id]) {
                //this.tabs.setSelection([this.__tabPagesById[id]]);
            } else {
                this.__tabPagesById[id] = new kmcs.esadmin.ui.TableTab(id, data.url, data.index, data.type, data.properties);
                this.__tabPagesById[id].addListener('close', function(e) {
                   delete this.__tabPagesById[e.getTarget().getLabel()];
                }, this);
                
            }
            this.tabs.add(this.__tabPagesById[id]);
            this.tabs.setSelection([this.__tabPagesById[id]]);
        }
    }
    
    
    
})

