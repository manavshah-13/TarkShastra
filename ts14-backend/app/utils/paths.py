import pathlib

def get_project_root() -> pathlib.Path:
    """
    Returns the root directory of the project by searching for a marker file 
    (like .git or requirements.txt). Defaults to current working directory if not found.
    """
    current_path = pathlib.Path(__file__).resolve()
    # Markers that indicate the true root of the project
    # We look for the coexistence of backend and frontend or the .git folder
    for parent in current_path.parents:
        if (parent / ".git").exists():
            return parent
        if (parent / "ts14-backend").exists() and (parent / "frontend").exists():
            return parent
            
    # Fallback to searching for a unique marker in the true root
    for parent in current_path.parents:
        if (parent / "TS-PS14.csv").exists():
            return parent
            
    # Ultimate fallback (4 levels up from paths.py)
    return current_path.parents[3]
