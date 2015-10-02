<?php
namespace kalyabin\maplocation;

use yii\web\AssetBundle;

/**
 * SelectMapLocationWidget assets class
 *
 * @author Max Kalyabin <maksim@kalyabin.ru>
 * @package yii2-select-google-map-location
 * @copyright (c) 2015, Max Kalyabin, http://github.com/kalyabin
 */
class SelectMapLocationAssets extends AssetBundle
{
    public $sourcePath = '@kalyabin/yii2-select-map-location/_assets';
    public $css = [];
    public $js = [
        'js/select-map-location.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'kalyabin\maplocation\GoogleMapAssets',
    ];
}
