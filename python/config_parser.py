import toml
from datetime import datetime

# Function to parse the TOML file and retrieve necessary information
def parse_config(file_path):
    # Read the TOML file
    with open(file_path, 'r') as toml_file:
        config_data = toml.load(toml_file)
    
    # Extracting the relevant information
    starttime = config_data['starttime']
    endtime = config_data['endtime']
    input_dir = config_data['input_dir']
    results_dir = config_data['results_dir']
    dt = config_data['solver']['dt']
    saveat = config_data['solver']['saveat']
    
    return starttime, endtime, input_dir, results_dir, dt, saveat
