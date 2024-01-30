# Install postgres-client-16 (pg_dump and psql)
apt install lsb-release gnupg2
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install postgresql-client-16

# Ssh into railway container, and run
pg_dump postgresql://postgres:password@roundhouse.proxy.rlwy.net:32566/railway | psql postgresql://postgres:password@monorail.proxy.rlwy.net:46400/railway
