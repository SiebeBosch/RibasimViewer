import os
import geopandas as gpd
import fiona

def copy_geopackage(src_gpkg_path, dest_gpkg_path):
    """
    Copies all layers from the source Geopackage to the destination Geopackage.
    """
    # List all layers in the source Geopackage
    layers = fiona.listlayers(src_gpkg_path)
    for layer in layers:
        # Read each layer
        gdf = gpd.read_file(src_gpkg_path, layer=layer)
        # Write to the destination Geopackage (append if more than one layer)
        gdf.to_file(dest_gpkg_path, layer=layer, driver="GPKG")

