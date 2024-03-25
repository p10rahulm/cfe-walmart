# Type the command "cmd < synchronizeCloudLinux.sh" on windows
# Or the command "./synchronizeCloudLinux.sh" on linux
# Preliminary Checks:
# 1. Ensure "gcloud auth login" is already done
# 2. Ensure that you are on the IISc CISCO VPN

gsutil -m rsync -r assets gs://www.cstheoryseminars.org/assets
echo "Assets Directory Synced"
gsutil -m rsync -r content gs://www.cstheoryseminars.org/content
echo "Contents Directory Synced"
gsutil -m rsync ./ gs://www.cstheoryseminars.org
# gsutil cp index.html gs://www.cstheoryseminars.org
echo "Base Directory Synced"


# Now Git changes
git add -A
git commit -m "content changes"
git push


# Now attempt to directly update website through SSH
# Ensure local computer's ssh credentials are added to remote machine's ~/.ssh/authorized_keys
ssh -t msrseminar@csacloud.iisc.ac.in -p 3232 "./syncwalmart.sh"
echo "Please check that the website https://www.csa.iisc.ac.in/cfe-walmart/ is updated"
# exit
