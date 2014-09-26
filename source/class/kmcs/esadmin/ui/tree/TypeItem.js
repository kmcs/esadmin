/**
 * Tree item for ElasticSearch type.
 */
qx.Class.define("kmcs.esadmin.ui.tree.TypeItem", {
   
    extend : qx.ui.tree.TreeFile,
    
    construct : function(typeName, properties) {
      this.base(arguments, typeName);
      this._initComponents();
      this.setName(typeName);
      this.setProperties(properties);
    },
    
    properties : {
        /**
         * type name.
         */
        name : {
            check : 'String'
        },
        
        properties : {
            check : 'Object'
        }
    },
    
    members : {
        /**
         * initial widget structure.
         * @returns {void}
         */
        _initComponents : function() {
            this.__typeItemByName = {};
        }
    }
});