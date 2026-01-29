#! /usr/bin/env python3
import base64
import os
import sys
import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError


######
# GLOBALS
######

ENDPOINT = "http://localhost:3000/projects"

DRY_RUN = False
LOG_LEVELS = ["DEBUG", "INFO", "WARNING", "ERROR", "SILENT"]
LOG_LEVEL = "WARNING"

######
# REPORTING FUNCTIONS
######

def report_error(message: str):
    if LOG_LEVEL not in ["ERROR", "WARNING", "INFO", "DEBUG"]:
        return
    print(f"\033[31m[ERROR] {message}\033[0m")


def report_warning(message: str):
    if LOG_LEVEL not in ["WARNING", "INFO", "DEBUG"]:
        return
    print(f"\033[93m[WARNING] {message}\033[0m")


def report_debug(message: str):
    if LOG_LEVEL not in ["DEBUG"]:
        return
    print(f"\033[92m[DEBUG] {message}\033[0m")


######
# PROCESSING FUNCTIONS
######

def process_png(path):
    with open(path, "rb") as image_file:
        data_bytes = base64.b64encode(image_file.read())
        data_base64 = data_bytes.decode("utf-8")
        return "data:image/png;base64," + data_base64

def process_txt(path):
    with open(path, "rt") as text_file:
        lines = text_file.readlines()

        cells = []

        for y in range(20):
            for x in range(20):
                char = lines[y][x]
                type = "Grass"
                if (char == "X"): type = "Lake"
                if (char == "#"): type = "Mountain"
                cells.append({
                    "x": x,
                    "y": y,
                    "type": type,
                    "hasTurbine": False
                })
        return cells


#####
# IMPORT FUNCTIONS
#####

def import_project(project: dict) -> str:
    report_debug(f'Importing project "{project['name']}"')

    data = json.dumps(project).encode("utf-8")
    headers = {"Content-Type": "application/json"}

    request = Request(ENDPOINT, data=data, headers=headers, method="POST")
    try:
        with urlopen(request) as response:
            if response.getcode() == 201:
                report_debug(f'Project "{project['name']}" created')
                return "created"
            else:
                report_error(f'Failed to create project "{project['name']}": HTTP {response.getcode()}')
                return "error"
    except HTTPError as http_err:
        report_error(f'Failed to create project "{project['name']}": HTTP error {http_err.code} - {http_err.reason}')
        return "error"
    except URLError as url_err:
        report_error(f'Failed to create project "{project['name']}": URL error - {url_err.reason}')
        return "error"


######
# MAIN FLOW
######

def main(path: str):
    if not os.path.isdir(path):
        report_error(f"Folder not found: {path}")
        sys.exit(1)
    
    report_debug("Processing map image file...")
    png_path = os.path.join(path, "map.png")
    if not os.path.isfile(png_path):
        report_error("Map image file not found in folder (map.png)")
        sys.exit(1)
    map_base64 = process_png(png_path)
    report_debug("Finished processing map image file...")

    report_debug("Processing map text file...")
    txt_path = os.path.join(path, "map.txt")
    if not os.path.isfile(txt_path):
        report_error("Map text file not found in folder (map.txt)")
        sys.exit(1)
    cells = process_txt(txt_path)
    report_debug("Finished processing map text file...")

    folder_name = os.path.basename(os.path.dirname(path))

    project = {
        "name": folder_name,
        "cells": cells,
        "mapData": map_base64
    }
    
    width = os.get_terminal_size().columns

    if DRY_RUN:
        if LOG_LEVEL != "SILENT":
            print(f"\033[92m{'=' * width}\033[0m")
            print(f"\033[92m|\033[0m \033[92mDry run: Finished processing project{' ' * (width - 39)}\033[92m|\033[0m")
            print(f"\033[92m|\033[0m \033[92m  => Skipping import due to dry run{' ' * (width - 38)}\033[92m|\033[0m")
            print(f"\033[92m{'=' * width}\033[0m")
        return
    else:
        if LOG_LEVEL != "SILENT":
            print(f"\033[92m{'=' * width}\033[0m")
            print(f"\033[92m|\033[0m \033[92mFinished processing project{' ' * (width - 30)}\033[0m\033[92m|\033[0m")
            print(f"\033[92m{'=' * width}\033[0m")


    if LOG_LEVEL != "SILENT":
        print("")
        print(f"\033[92mImporting project...", end="\r")


    import_project(project)

    if LOG_LEVEL != "SILENT":
        print(f"\n\n\033[92m{'=' * width}\033[0m")
        print(f"\033[92m|\033[0m \033[92mFinished importing project{' ' * (width - 29)}\033[0m\033[92m|\033[0m")
        print(f"\033[92m{'=' * width}\033[0m")


def print_help():
    print("Usage: import.py <path_to_folder> [options]")
    print("  --endpoint=<endpoint>   : Set the endpoint to import to (default: http://localhost:3000/projects)")
    print("  --log-level=<log_level> : Set the log level (DEBUG, INFO, WARNING, ERROR, SILENT)")
    print("  --dry-run, -r           : Process the data without actually importing it")
    print("  --debug, -d             : Print debug messages (overrides log level)")
    print("  --silent, -s            : Print no messages (overrides log level)")
    print("  --help, -h              : Print this help message")


if __name__ == "__main__":
    folder_path = None
    i = 1
    while i < len(sys.argv):
        arg = sys.argv[i]
        if arg.startswith("--"):
            if arg.startswith("--log-level="):
                LOG_LEVEL = arg.split("=")[1].upper()
            elif arg.startswith("--endpoint="):
                ENDPOINT = arg.split("=")[1]
            elif arg in ("--debug",):
                LOG_LEVEL = "DEBUG"
            elif arg in ("--silent",):
                LOG_LEVEL = "SILENT"
            elif arg in ("--dry-run", "-r"):
                DRY_RUN = True
            elif arg in ("--help", "-h"):
                print_help()
                sys.exit(0)
            else:
                report_error(f"Unknown option: {arg}")
                print_help()
                sys.exit(1)
            i += 1

        elif arg.startswith("-") and len(arg) > 1:
            for flag in arg[1:]:
                if flag == "d":
                    LOG_LEVEL = "DEBUG"
                elif flag == "s":
                    LOG_LEVEL = "SILENT"
                elif flag == "r":
                    DRY_RUN = True
                elif flag == "h":
                    print_help()
                    sys.exit(0)
                else:
                    report_error(f"Unknown short option: -{flag}")
                    print_help()
                    sys.exit(1)
            i += 1

        else:
            if folder_path is None:
                folder_path = arg
            else:
                report_error(f"Multiple folder paths provided: '{folder_path}' and '{arg}'")
                sys.exit(1)
            i += 1

    if folder_path is None:
        report_error("No folder path provided.")
        print_help()
        sys.exit(1)

    main(folder_path)
