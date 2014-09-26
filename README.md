esadmin
=======

Simple ElasticSearch Data Manipulation-Tool

![alt text](https://github.com/kmcs/esadmin/raw/master/screenshot.png "esadmin Screenshot")


Getting Started
---------------

1. Download the build file.
```sh
wget https://github.com/kmcs/esadmin/raw/master/dist.zip
```

2. Enter your ElasticSearch hosts and ports the index.html
```
      //...
      window.qx = {
          '$$environment': {
                'kmcs.esadmin.connections' : [
                    {'name' : 'my local ES', 'host' : 'localhost', 'port' : 9200},
                    {'name' : 'my other local ES', 'host' : 'localhost', 'port' : 9201}
                ]
            }
      };
      //...
```
3. Put all files to your webroot and start esadmin for example with http://localhost/esadmin/
 
You can double-click on the index types in the tree to open a tab.

**Caution:** You can edit a cell with a double click on it!!!

Kown Issues
-----------
Update a field with more than one item in the array is not working!!! You may loose your data!!!


License
----

GPL

