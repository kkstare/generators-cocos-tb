// NOTE: can't cache file on Taobao iOS end
$global.cc.assetManager.cacheManager.cacheEnabled = $global.cc.sys.os !== $global.cc.sys.OS_IOS;