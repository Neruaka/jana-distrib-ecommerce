-- Script de correction de la base de données
ALTER TABLE admin RENAME COLUMN reset_token_expires TO reset_token_expiry;
