# TODO:
- Make this as a script

# Restart services
redis-cli -c "FLUSHALL"
sudo service postgresql restart



# Backup XXX version
pg_dump -U postgres -d backendmedusa > v1.9.1__from_v1.8.2.sql

# Restore XXX version
psql -c "DROP DATABASE backendmedusa"
psql -c "CREATE DATABASE backendmedusa"
psql -U postgres backendmedusa < v1.9.1_2024_.sql



## 2023

# It's done with
sudo su postgres && pg_dump backendmedusa > ~/backend_dev_before_editing_categories.sql
sudo cp /var/lib/postgresql/backend_dev_before_editing_categories.sql .

# Backup production
pg_dump -h containers-us-west-178.railway.app -U postgres -p 5632 -W -F t railway > test.sql


# restore locally
pg_restore -U postgres -d backendmedusa -1 test.sql


# restore remote
psql -h containers-us-west-178.railway.app -U postgres -p 5632 railway < version_upgrade_23040982.sql
