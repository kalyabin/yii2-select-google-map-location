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
     * @inheritdoc
     */
    public static function register($view, $key)
    {
        /* @var $view \yii\web\View */
        $view->registerJsFile('https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&sensor=true&key=' . $key);
        return parent::register($view);
    }
}
