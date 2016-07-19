/**
 * Выбор местоположения - виджет.
 * Виджет запоминает координаты при вводе адреса в инпут и отображает карту Google.
 * Необходимо передавать опции:
 * - address - селектор, для указания адреса;
 * - latitude - селектор для указания широты;
 * - longitude - селектор для указания долготы;
 * - hideMarker - если определено, то не будет установлен маркер на карте при поиске локации;
 * - onLoadMap - если определена функциия, то она будет вызвана при инициализации карты;
 * - addressNotFound - сообщение о не найденном адресе.
 *
 * @param {Object}  options
 * @param {boolean} options.draggable Marker draggable Option
 * TODO: describe other options here
 */
(function($) {
    $.fn.selectLocation = function(options) {
        var self = this;
        var map;

        $(document).ready(function() {
            var mapOptions = {
                center: new google.maps.LatLng(55.997778, 37.190278),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                panControl: true
            };
            map = new google.maps.Map($(self).get(0), mapOptions);

            if (options.onLoadMap) {
                options.onLoadMap(map);
            }

            // маркер найденной точки
            var marker = null;

            /**
             * Создать маркер на карте
             * Передается объект типа google.maps.LatLng
             * @param {Object} latLng
             */
            var createMarker = function(latLng) {
                // удалить маркер если уже был
                if (marker) {
                    marker.remove();
                }
                if (options.hideMarker) {
                    // не нужно устанавливать маркер
                    return;
                }
                marker = new google.maps.Marker({
                    'position'          : latLng,
                    'map'               : map,
                    'draggable'         : options.draggable
                });

                if(options.draggable) {
                    google.maps.event.addListener(marker, 'dragend', function() {
                        console.log(marker.getPosition());
                        marker.changePosition(marker.getPosition());
                    });
                }

                marker.remove = function() {
                    google.maps.event.clearInstanceListeners(this);
                    this.setMap(null);
                };

                marker.changePosition = function(pos) {
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode(
                        {
                            latLng: pos
                        },
                        function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                setLatLngAttributes(results[0].geometry.location);
                            }

                            return false;
                        }
                    );
                }
            };

            /**
             * Установить координаты точки
             * @param {Object} point объект типа google.maps.LatLng
             */
            var setLatLngAttributes = function(point) {
                $(options.latitude).val(point.lat());
                $(options.longitude).val(point.lng());
            };

            /**
             * Выбрать местоположение, на входе объект у которго есть geometry
             * @param {Object} item
             */
            var selectLocation = function(item) {
                if (!item.geometry) {
                    return;
                }
                var bounds = item.geometry.viewport ? item.geometry.viewport : item.geometry.bounds;
                var center = null;
                if (bounds) {
                    map.fitBounds(new google.maps.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast()));
                }
                if (item.geometry.location) {
                    center = item.geometry.location;
                }
                else if (bounds) {
                    var lat = bounds.getSouthWest().lat() + ((bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) / 2);
                    var lng = bounds.getSouthWest().lng() + ((bounds.getNorthEast().lng() - bounds.getSouthWest().lng()) / 2);
                    center = new google.maps.LatLng(lat, lng);
                }
                if (center) {
                    map.setCenter(center);
                    createMarker(center);
                    setLatLngAttributes(center);
                }
            };

            // валидация адреса, если не найдены координаты
            // испльзуется событие из ActiveForm
            if ($(options.address).parents('form').length) {
                var $form = $(options.address).parents('form');
                $form.on('afterValidateAttribute', function(e, attribute, messages) {
                    if (attribute.input == options.address && !$(options.latitude).val() && !$(options.longitude).val() && !messages.length) {
                        // не найдены координаты
                        messages.push(options.addressNotFound);
                        e.preventDefault();
                    }
                });
            }

            // автокомплит для поиска местонахождения
            var autocomplete = new google.maps.places.Autocomplete($(options.address).get(0));

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                if (!place) {
                    return;
                }
                selectLocation(place);
            });

            var defaults = {
                'lat'       : $(options.latitude).val(),
                'lng'       : $(options.longitude).val()
            };
            if (defaults.lat && defaults.lng) {
                var center = new google.maps.LatLng(defaults.lat, defaults.lng);
                map.setCenter(center);
                createMarker(center);
                setLatLngAttributes(center);
            }
        });
    };
})(jQuery);