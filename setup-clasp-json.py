# Hey there! Are you trying to set up the development environment? See `docs/setup-dev-env.md`.

# Copyright (c) 2022 FRC 1678 Citrus Circuits

import json
import os.path


clasp_dict = {
    "rootDir": "./src"
}

if os.path.exists("./.clasp.json"):
    res = input("Seems like there's already an ID set. Override? (y/N) ")
    if res.lower() != "y":
        print("Nothing done, exiting.")
        exit(0)

clasp_dict["scriptId"] = input("Paste the project ID here: ")

try:
    with open(".clasp.json", "w") as f:
        json.dump(clasp_dict, f)
    print("Success! You can now run clasp commands.")
    exit(0)
except Exception as e:
    print("Oh no, something went wrong:")
    print(e)
    print("Exiting.")
    exit(1)
