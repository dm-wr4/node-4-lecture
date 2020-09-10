INSERT INTO users (email, hash, is_admin)
VALUES ($1, $2, $3)
returning id, email;