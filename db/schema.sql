CREATE DATABASE IF NOT EXISTS ott_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ott_db;

CREATE TABLE users (
    user_id     VARCHAR(10)  PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    age         INT          CHECK (age >= 13 AND age <= 120),
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE subscription_plans (
    plan_id   VARCHAR(10)   PRIMARY KEY,
    plan_name VARCHAR(50)   NOT NULL,
    price     DECIMAL(8,2)  NOT NULL,
    duration  INT           NOT NULL COMMENT 'Duration in days'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE payments (
    payment_id VARCHAR(15)  PRIMARY KEY,
    user_id    VARCHAR(10)  NOT NULL,
    plan_id    VARCHAR(10)  NOT NULL,
    amount     DECIMAL(8,2) NOT NULL,
    mode       ENUM('UPI','Card','NetBanking','Wallet') NOT NULL,
    date       DATE         NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE genres (
    genre_id   VARCHAR(10)  PRIMARY KEY,
    genre_name VARCHAR(50)  NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE shows (
    show_id      VARCHAR(10)  PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    release_year YEAR         NOT NULL,
    language     VARCHAR(50)  NOT NULL,
    duration     INT          COMMENT 'Runtime in minutes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE show_genres (
    show_id  VARCHAR(10) NOT NULL,
    genre_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (show_id, genre_id),
    FOREIGN KEY (show_id)  REFERENCES shows(show_id)  ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE watch_history (
    history_id         VARCHAR(15) PRIMARY KEY,
    user_id            VARCHAR(10) NOT NULL,
    show_id            VARCHAR(10) NOT NULL,
    last_access_time   TIME,
    completion_percent TINYINT     CHECK (completion_percent BETWEEN 0 AND 100),
    season             INT,
    episode            INT,
    duration_watched   INT         COMMENT 'Minutes watched',
    device             ENUM('Mobile','Laptop','TV','Tablet') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)  ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES shows(show_id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE reviews (
    review_id VARCHAR(15) PRIMARY KEY,
    user_id   VARCHAR(10) NOT NULL,
    show_id   VARCHAR(10) NOT NULL,
    rating    TINYINT     CHECK (rating BETWEEN 1 AND 5),
    comment   TEXT,
    UNIQUE KEY unique_user_show_review (user_id, show_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
