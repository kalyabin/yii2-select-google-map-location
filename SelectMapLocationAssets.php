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
    public $sourcePath = '@vendor/kalyabin/yii2-select-google-map-location/js';
    public $css = [];
    public $js = [
        'select-google-map-location.js',
    ];
    public $depends = [
        'yii\web\YiiAsset',
    ];

    /**
     * Google API Key
     *
     * @var string
     */
    public static $googleMapApiKey;

    /**
     * @inheritdoc
     */
    public static function register($view)
    {
        /* @var $view \yii\web\View */
        $view->registerJsFile('https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&sensor=true&key=' . self::$googleMapApiKey);
        return parent::register($view);
    }
}
