# This is the file on remote iisc host server that runs the synchronization commands.

# In this file we will setup the sync
cd cfe-walmart
git pull origin main
cp index.html /var/www/cfe-walmart/index.html
cp people.html /var/www/cfe-walmart/people.html
cp events.html /var/www/cfe-walmart/events.html
cp news.html /var/www/cfe-walmart/news.html
cp joinus.html /var/www/cfe-walmart/joinus.html
cp -R assets /var/www/cfe-walmart/
cp -R content /var/www/cfe-walmart/
