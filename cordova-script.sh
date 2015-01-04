#ensure cordova is installed: npm install -g cordova

if [ "$1" = "-h" ]; then
	echo "\t--device deploys to device"
	exit 0
fi

DEPLOY_TO="emulator"

if [ "$1" = "--device" ]; then
	DEPLOY_TO="device"
fi

gulp compile

cordova create pheux-demo-cordova com.pheuxstein.pheuxdemo pheux-demo-cordova
cd pheux-cordova
cordova plugin add com.telerik.plugins.wkwebview
cordova prepare
cordova platform add ios
#cordova platform add android
echo "\nRemoving default cordova www directory"
rm -rf www/*
echo "\nCopying lunch to www"
cp -r ../dest/* www
echo "\nCopying codova config"
cp ../cordova-config.xml config.xml
cordova build
if [ "$DEPLOY_TO" = "device" ]; then
	cordova run ios --justlaunch
else
	cordova emulate ios
fi
