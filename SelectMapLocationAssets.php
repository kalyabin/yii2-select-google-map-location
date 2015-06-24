<?php
namespace app\assets;

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
    public $sourcePath = '@app/_assets';
    public $baseUrl = '@web/assets';
    public $css = [];
    public $js = [
        'js/select-map-location.js',
    ];
    public $depends = [
        'app\assets\GoogleMapAssets',
    ];
}
