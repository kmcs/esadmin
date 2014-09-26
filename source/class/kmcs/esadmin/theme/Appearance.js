/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * @asset(qx/icon/Tango/16/places/network-server.png)
 */
qx.Theme.define("kmcs.esadmin.theme.Appearance",
{
  extend : qx.theme.simple.Appearance,

  appearances :
  {
      
      "tree-item-connection" : {
          "alias" : "tree-folder",
          "include" : "tree-folder",
          
          style : function(state) {
              return({
                  'icon' : 'icon/16/places/network-server.png'
              });
          }
      }
  }
});