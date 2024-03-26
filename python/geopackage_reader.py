import geopandas as gpd

def read_geopackage(gp_path):
    gdf = gpd.read_file(gp_path)
    # Perform operations with the geodataframe
    return gdf
