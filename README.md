Pheux
===========
A virtualized scrolling component for RactiveJS

Demo
----
Check us out at: http://pheux.herokuapp.com/

Best viewed in Cordova or iOS8 Mobile Safari.

Usage
-----
Include pheux as a Ractive component:

`Ractive.components.pheux = Pheux.ractiveComponent`

In a ractive template, use pheux like so:

```
	<pheux dataTable="{{anArrayOfObjects}}" rowHeight="{{rowHeightInPixels}}">
		<-- template for each row-->
	</pheux>
```

Cordova
-------
Try it out on a device by running `./cordova-script.sh --device`


