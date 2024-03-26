from config_parser import parse_config
from geopackage_reader import read_geopackage
from arrow_reader import read_arrow_file
from geopackage_copy import copy_geopackage
from arrow_geopackage_merger import add_dataframe_to_gpkg

def main():
    # Specify the path to your TOML configuration and Geopackage files
    toml_path = r"c:\SYNC\PROJECTEN\H3122.TKI.LHM\99.Modelschematisaties\Rijkswateren.2024.01.1\hws.toml"
    gpkg_src_path = r"c:\SYNC\PROJECTEN\H3122.TKI.LHM\99.Modelschematisaties\Rijkswateren.2024.01.1\database.gpkg"
    arrow_path = r"c:\SYNC\PROJECTEN\H3122.TKI.LHM\99.Modelschematisaties\Rijkswateren.2024.01.1\results\basin.arrow"
    gpkg_dst_path = r"c:\SYNC\PROJECTEN\H3122.TKI.LHM\99.Modelschematisaties\Rijkswateren.2024.01.1\database_complete.gpkg"

    # Parse the configuration
    #config = parse_config(toml_path)
    
    # Read the Geopackage
    #gdf = read_geopackage(gpkg_src_path)

    
    # Now you can use 'config' and 'gdf' as needed
    #print(config)
    #print(gdf)
    #print(df)

    # we can copy our geopackage so we can later add the results from our .arrow files to it
    copy_geopackage(gpkg_src_path,gpkg_dst_path)

    # Read the Arrow file
    df = read_arrow_file(arrow_path)
    
    #write our arrow data to a new layer in the geopackage
    add_dataframe_to_gpkg(df, gpkg_dst_path,"arrow_basin")


if __name__ == "__main__":
    main()

