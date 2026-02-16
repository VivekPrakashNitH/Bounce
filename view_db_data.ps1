Write-Host "--- USERS ---"
docker exec curious-sys-db psql -U postgres -d curioussys -c "SELECT id, name, email FROM users;"

Write-Host "`n--- REVIEWS (Community Feedback) ---"
docker exec curious-sys-db psql -U postgres -d curioussys -c "SELECT * FROM discussions;"

Write-Host "`n--- LEVEL COMMENTS ---"
docker exec curious-sys-db psql -U postgres -d curioussys -c "SELECT * FROM level_comments;"
