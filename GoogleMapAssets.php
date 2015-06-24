<?php
namespace app\assets;

use yii\web\AssetBundle;

/**
 * Include google map JavaScript
 *
 * @author Max Kalyabin <maksim@kalyabin.ru>
 * @package yii2-select-google-map-location
 * @copyright (c) 2015, Max Kalyabin, http://github.com/kalyabin
 */
class GoogleMapAssets extends AssetBundle
{
    public $css = [];
    public $js = [
        'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&sensor=true',
    ];
    public $depends = [];
}
