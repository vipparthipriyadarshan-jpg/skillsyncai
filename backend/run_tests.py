"""
Skill Sync AI - Labour Market Analytics Test Runner.
Executes pytest across unit, integration, and API test suites.
"""

import sys
import subprocess
import os

def main():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    print("=============================================================")
    print("   Skill Sync AI: Labour Market Analytics Engine Test Suite")
    print("=============================================================\n")

    # Run pytest with verbose output
    cmd = [sys.executable, "-m", "pytest", "tests", "-v", "--tb=short"]
    result = subprocess.run(cmd, cwd=backend_dir)
    sys.exit(result.returncode)

if __name__ == "__main__":
    main()
