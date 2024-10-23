# Type the command "cmd < synchronizeCloud.sh" on windows
# Or the command "./synchronizeCloud.sh" on linux after ensuring chmod +rwx permissions on this file.
# Preliminary Checks:
# 1. Ensure "gcloud auth login" is already done
# 2. Ensure that you are on the IISc CISCO VPN

# Run some python scripts to ensure the files lists are updated.
python python_scripts/create_file_lists.py

# Pull changes from others
git pull --set-upstream origin main

# Git changes
git add .
git commit -m "content changes"
git push


# Now attempt to directly update website through SSH
# Ensure local computer's ssh credentials are added to remote machine's ~/.ssh/authorized_keys
ssh -t msrseminar@csacloud.iisc.ac.in -p 3232 "./syncwalmart.sh"
echo "Please check that the website https://www.csa.iisc.ac.in/cfe-walmart/ is updated"
# exit
