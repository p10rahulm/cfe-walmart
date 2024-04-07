# This is the file on remote iisc host server that runs the synchronization commands.

# In this file we will setup the sync
cd cfe-walmart
git pull origin main
cp index.html /var/www/cfe-walmart/index.html
cp faculty.html /var/www/cfe-walmart/faculty.html
cp postdocs.html /var/www/cfe-walmart/postdocs.html
cp phds.html /var/www/cfe-walmart/phds.html
cp predocs.html /var/www/cfe-walmart/predocs.html
cp events.html /var/www/cfe-walmart/events.html
cp news.html /var/www/cfe-walmart/news.html
cp joinus.html /var/www/cfe-walmart/joinus.html
cp -R assets /var/www/cfe-walmart/
cp -R content /var/www/cfe-walmart/
