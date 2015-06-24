# yii2-select-map-location
Yii2 widget to select location at map and choose map coordinates

This extension adds functionality to select the location on the Google map. The extension indicates the model and attributes, which stores the address, latitude and longitude.

When choosing a location map of switches and sets the marker to the selected location. The attributes recorded address and coordinates of the selected location.

## Manual usage

Change classes namespace:
* SelectMapLocationWidget
* SelectMapLocationAssets
* GoogleMapAssets

Change in SelectMapLocationAssets path to JavaScript:
```php
class SelectMapLocationAssets extends AssetBundle
{
    public $sourcePath = '@app/_assets';
    public $baseUrl = '@web/assets';
    ...
}
```

Declare model class:

```php
class SearchLocation extends \yii\base\Model
{
    ...
    public $address;
    public $location;
    public $latitude;
    ...
}
```

Render widget:
```php
$model = new SearchLocation();
$form = \yii\widgets\ActiveForm::begin();
...
$form->field($model, 'attribute')->widget(\app\widgets\SelectMapLocationWidget::className(), [
    'attributeLatitude' => 'latitude',
    'attributeLongitude' => 'longitude',
]);
...
\yii\widgets\ActiveForm::end();
```

TODO: integrate it's to composer
