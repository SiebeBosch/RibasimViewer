import sqlite3
import pandas as pd

def add_dataframe_to_gpkg(df, dest_gpkg_path, table_name):
    """
    Adds non-spatial data from a pandas DataFrame to a Geopackage as an attribute table
    using SQLite directly.
    """
    # Connect to the Geopackage as a SQLite database
    conn = sqlite3.connect(dest_gpkg_path)
    cursor = conn.cursor()
    
    # Optional: Drop the table if it already exists to avoid conflicts
    cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
    
    # Use pandas to_sql method to insert the DataFrame into the SQLite database
    # Replace 'table_name' with your actual table name
    df.to_sql(table_name, conn, if_exists='replace', index=False)
    
    # Commit changes and close the connection
    conn.commit()
    conn.close()