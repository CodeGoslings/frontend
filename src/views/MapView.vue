<template>
    <div class="h-screen w-full">
        <div class="h-full" ref="mapRef"></div>
        <div class="fixed top-4 left-1/2 -translate-x-1/2 flex items-start gap-4">
            <div class="flex gap-2">
                <button @click="clearMarkers" class="px-4 py-2 bg-red-600 text-white rounded-lg">
                    Clear All
                </button>
                <button @click="drawRoute" class="px-4 py-2 bg-green-600 text-white rounded-lg">
                    Draw Route
                </button>
            </div>
            <div class="bg-white rounded-lg shadow-lg">
                <button
                    @click="isMarkersExpanded = !isMarkersExpanded"
                    class="w-full px-4 py-2 flex justify-between items-center">
                    <h2 class="text-xl font-bold">Markers</h2>
                    <span class="transform transition-transform duration-200"
                        :class="{'rotate-180': !isMarkersExpanded}">
                        ▼
                    </span>
                </button>
                <transition name="collapse">
                    <div v-show="isMarkersExpanded" class="p-4 border-t">
                        <ul>
                            <li v-for="(marker, index) in markers"
                                :key="index"
                                class="flex items-center mb-2">
                                <input type="checkbox"
                                    v-model="marker.selected"
                                    class="mr-2">
                                <input type="text"
                                    v-model="marker.name"
                                    @blur="saveMarkerName(index)"
                                    @keyup.enter="$event.target.blur()"
                                    class="mr-2 px-2 py-1 border rounded focus:outline-none focus:border-blue-500"
                                    :placeholder="`Marker ${index + 1}`">
                                <button @click="removeMarker(marker)"
                                        class="px-2 py-1 bg-red-500 text-white rounded">
                                    Remove
                                </button>
                            </li>
                        </ul>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MapView',
    data() {
        return {
            map: null,
            markers: [],
            directionsService: null,
            directionsRenderer: null,
            isMarkersExpanded: true
        }
    },
    async mounted() {
        try {
            await this.loadGoogleMapsScript();
            // Wait for Google Maps to be available
            await new Promise(resolve => {
                if (window.google) {
                    resolve();
                } else {
                    window.initMap = () => resolve();
                }
            });
            await this.initMap();
        } catch (error) {
            console.error('Failed to initialize map:', error);
            this.error = error.message;
        }
    },
    methods: {
        async loadGoogleMapsScript() {
            return new Promise((resolve, reject) => {
                if (window.google) {
                    resolve()
                    return
                }

                const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                const script = document.createElement('script')
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
                script.async = true
                script.defer = true

                script.onload = () => {
                    resolve()
                }
                script.onerror = () => {
                    reject(new Error('Failed to load Google Maps'))
                }

                document.head.appendChild(script)
            })
        },
        async initMap() {
            try {
                const google = window.google
                if (!google) {
                    throw new Error('Google Maps not loaded')
                }

                this.map = new google.maps.Map(this.$refs.mapRef, {
                    center: { lat: 0, lng: 0 },
                    zoom: 3,
                    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID
                })

                this.directionsService = new google.maps.DirectionsService()
                this.directionsRenderer = new google.maps.DirectionsRenderer()
                this.directionsRenderer.setMap(this.map)

                this.map.addListener('click', (e) => {
                    this.addMarkerAtLocation(e.latLng)
                })

                this.isLoading = false
            } catch (error) {
                console.error('Error initializing map:', error)
                this.isLoading = false
            }
        },

        createMarkerElement() {
            const markerDiv = document.createElement('div');
            markerDiv.className = 'custom-marker';

            const pinDiv = document.createElement('div');
            pinDiv.className = 'pin';

            markerDiv.appendChild(pinDiv);
            return markerDiv;
        },

        addMarkerAtLocation(location) {
            const marker = new google.maps.Marker({
                position: location,
                map: this.map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#FF0000",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#FFFFFF"
                },
                visible: true
            });

            this.markers.push({
                marker: marker,
                position: location,
                selected: false,
                name: `Marker ${this.markers.length + 1}` // Add name property
            });
        },

        saveMarkerName(index) {
            if (!this.markers[index].name) {
                this.markers[index].name = `Marker ${index + 1}`;
            }
        },

        reloadMap() {
            if (!this.map) return;

            const markerPositions = this.markers.map(m => ({
                position: m.position,
                selected: m.selected
            }));

            this.markers.forEach(m => m.marker.setMap(null));
            this.markers = [];

            if (this.directionsRenderer) {
                this.directionsRenderer.setMap(null);
            }

            this.initMap().then(() => {
                markerPositions.forEach(pos => {
                    this.addMarkerAtLocation(pos.position);
                    this.markers[this.markers.length - 1].selected = pos.selected;
                });

                const selectedMarkers = this.markers.filter(m => m.selected);
                if (selectedMarkers.length >= 2) {
                    this.drawRoute();
                }
            });
        },

        removeMarker(marker) {
            marker.map = null
            const index = this.markers.indexOf(marker)
            if (index > -1) {
                this.markers.splice(index, 1);
                this.reloadMap();

                const selectedMarkers = this.markers.filter(m => m.selected)
                if (selectedMarkers.length >= 2) {
                    this.drawRoute()
                }
            }
        },

        clearMarkers() {
            this.markers.forEach(marker => marker.map = null)
            this.markers = []
            if (this.directionsRenderer) {
                this.directionsRenderer.setDirections({ routes: [] })
            }
            this.reloadMap();
        },

        drawRoute() {
            const selectedMarkers = this.markers.filter(marker => marker.selected)
            if (selectedMarkers.length < 2) return

            const waypoints = selectedMarkers.slice(1, -1).map(marker => ({
                location: marker.position,
                stopover: true
            }))

            const request = {
                origin: selectedMarkers[0].position,
                destination: selectedMarkers[selectedMarkers.length - 1].position,
                waypoints: waypoints,
                travelMode: 'DRIVING'
            }

            this.directionsService.route(request, (result, status) => {
                if (status === 'OK') {
                    this.directionsRenderer.setDirections(result)
                }
            })
        }
    }
}
</script>

<style>
.custom-marker {
    width: 24px;
    height: 24px;
    position: relative;
}

.pin {
    width: 100%;
    height: 100%;
    background-color: #4285f4;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.custom-marker.selected .pin {
    background-color: #ea4335;
}

.collapse-enter-active,
.collapse-leave-active {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
    opacity: 0;
    max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
    opacity: 1;
    max-height: 300px;
}
input[type="text"] {
    min-width: 100px;
    background: transparent;
}

input[type="text"]:hover {
    background: #f3f4f6;
}
</style>
