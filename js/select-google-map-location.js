/**
 * Select map location widget.
 * The widget writes the coordinates to hidden inputs when enter address into text input or move marker on the map.
 *
 * @see https://developers.google.com/maps/documentation/javascript/tutorial
 *
 * @param {Object}  options
 * @param {boolean} options.draggable Marker draggable Option
 * @param {String|jQuery|HTMLInputElement} options.address Address input selector
 * @param {String|jQuery|HTMLInputElement} options.latitude Latitude input selector
 * @param {String|jQuery|HTMLInputElement} options.latitude Longitude input selector
 * @param {Boolean} options.hideMarker Hide\show marker to selected location
 * @param {Function|undefined} options.onLoadMap Callback function to render map
 * @param {String|undefined} options.addressNotFound Description for not found address error
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

            // marker for founded point
            var marker = null;

            // create marker when map clicked
            if (options.draggable) {
                google.maps.event.addListener(map, 'click', function(e) {
                    geocodePosition(e.latLng);
                    createMarker(e.latLng);
                });
            }

            /**
             * Geocode position by selected latitude and longitude
             *
             * @param {Object} latLng google.maps.LatLng
             */
            var geocodePosition = function(latLng) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode(
                    {
                        latLng: latLng
                    },
                    function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            if (results[0].formatted_address) {
                                // revert geocode
                                $(options.address).val(results[0].formatted_address);
                            }
                            selectLocation(results[0]);
                        }

                        return false;
                    }
                );
            };

            /**
             * Create marker into map
             *
             * Input object type - google.maps.LatLng
             *
             * @param {Object} latLng
             */
            var createMarker = function(latLng) {
                // remove older marker
                if (marker) {
                    marker.remove();
                }
                if (options.hideMarker) {
                    // do not use marker
                    return;
                }
                marker = new google.maps.Marker({
                    'position'          : latLng,
                    'map'               : map,
                    'draggable'         : options.draggable
                });

                if (options.draggable) {
                    google.maps.event.addListener(marker, 'dragend', function() {
                        marker.changePosition(marker.getPosition());
                    });
                }

                marker.remove = function() {
                    google.maps.event.clearInstanceListeners(this);
                    this.setMap(null);
                };

                marker.changePosition = geocodePosition;
            };

            /**
             * Touch point coordinates
             *
             * @param {Object} point google.maps.LatLng
             */
            var setLatLngAttributes = function(point) {
                $(options.latitude).val(point.lat());
                $(options.longitude).val(point.lng());
            };

            /**
             * Select location with geometry
             *
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

            // address validation using yii.activeForm.js
            if ($(options.address).parents('form').length) {
                var $form = $(options.address).parents('form');
                $form.on('afterValidateAttribute', function(e, attribute, messages) {
                    if (attribute.input === options.address && !$(options.latitude).val() && !$(options.longitude).val() && !messages.length) {
                        // address not found
                        messages.push(options.addressNotFound);
                        e.preventDefault();
                    }
                });
            }

            // address autocomplete using google autocomplete
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
