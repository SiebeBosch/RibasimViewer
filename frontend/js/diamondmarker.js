L.DiamondMarker = L.Path.extend({
    options: {
        fill: true,
        radius: 8,
        fillColor: '#ff0000',
        color: 'black',
        weight: 1,
        fillOpacity: 1
    },

    initialize: function (latlng, options) {
        L.setOptions(this, options);
        this._latlng = L.latLng(latlng);
    },

    setLatLng: function (latlng) {
        this._latlng = L.latLng(latlng);
        this.redraw();
        return this;
    },

    getLatLng: function () {
        return this._latlng;
    },

    _project: function () {
        this._point = this._map.latLngToLayerPoint(this._latlng);
        this._updateBounds();
    },

    _updateBounds: function () {
        var w = this.options.radius,
            s = w * Math.sqrt(2);
        this._pxBounds = new L.Bounds(
            this._point.subtract([s, s]),
            this._point.add([s, s]));
    },

    _update: function () {
        if (this._map) {
            this._updatePath();
        }
    },

    _updatePath: function () {
        this._renderer._updateDiamondMarker(this);
    },

    _empty: function () {
        return this._pxBounds && !this._renderer._bounds.intersects(this._pxBounds);
    }
});

L.Canvas.include({
    _updateDiamondMarker: function (layer) {
        var p = layer._point,
            ctx = this._ctx,
            r = layer.options.radius,
            x = p.x,
            y = p.y,
            s = r * Math.sqrt(2);

        ctx.beginPath();
        ctx.moveTo(x, y - s);
        ctx.lineTo(x + s, y);
        ctx.lineTo(x, y + s);
        ctx.lineTo(x - s, y);
        ctx.lineTo(x, y - s);

        if (layer.options.fill) {
            ctx.globalAlpha = layer.options.fillOpacity;
            ctx.fillStyle = layer.options.fillColor;
            ctx.fill();
        }

        if (layer.options.weight) {
            ctx.globalAlpha = 1;
            ctx.lineWidth = layer.options.weight;
            ctx.strokeStyle = layer.options.color;
            ctx.stroke();
        }
    }
});
