CREATE TABLE cuisines (
                          id SERIAL PRIMARY KEY,
                          name varchar(128),
                          slug varchar(128) UNIQUE NOT NULL,
                          description text,
                          w_value float
);

CREATE TABLE flavors (
                         id SERIAL PRIMARY KEY,
                         name varchar(64),
                         description text,
                         w_value float
);

CREATE TABLE restrictions (
                              id SERIAL PRIMARY KEY,
                              name varchar(128),
                              description text,
                              w_value float
);

CREATE TABLE ingredients (
                             id SERIAL PRIMARY KEY,
                             name varchar(128),
                             description text,
                             flavor jsonb
);

CREATE TABLE keycloak (
                          id varchar(64) PRIMARY KEY,
                          username varchar(64) UNIQUE NOT NULL,
                          email varchar(255) UNIQUE NOT NULL,
                          image_url varchar(255),
                          name varchar(255),
                          type int DEFAULT 0,
                          lat float,
                          lng float,
                          activate bool DEFAULT true
);

CREATE TABLE users (
                       id VARCHAR(64) PRIMARY KEY,
                       age integer,
                       prefer_cuisine jsonb,
                       prefer_flavor jsonb,
                       allergic jsonb,
                       restriction_id integer,
                       dining_out_frequecy int,
                       dining_partner text[],
                       created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
                       updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE restaurants (
                             id VARCHAR(64) PRIMARY KEY,
                             phone varchar(12),
                             contact jsonb,
                             description varchar(4000),
                             detail_address VARCHAR(255) NOT NULL,
                             operating_hours varchar(64),
                             documents jsonb,
                             is_approved boolean DEFAULT false,
                             created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
                             updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE follows (
                         user_id varchar(64),
                         restaurant_id varchar(64),
                         created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
                         PRIMARY KEY (user_id, restaurant_id)
);

CREATE TABLE dishes (
                        id SERIAL PRIMARY KEY,
                        restaurant_id varchar(64),
                        cuisine_id integer,
                        name VARCHAR(100) NOT NULL,
                        description TEXT,
                        ingradient jsonb,
                        restriction jsonb,
                        price DECIMAL(10,2) NOT NULL,
                        created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
                        updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE reviews (
                         id SERIAL PRIMARY KEY,
                         author_id VARCHAR(64),
                         dish_id integer,
                         rating INTEGER,
                         content TEXT,
                         medias jsonb,
                         reply text,
                         created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
                         updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE posts (
                       id SERIAL PRIMARY KEY,
                       author_id varchar(64),
                       content TEXT NOT NULL,
                       media JSONB,
                       metadata JSONB,
                       created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
                       updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE post_comments (
                               id SERIAL PRIMARY KEY,
                               post_id INTEGER,
                               author_id varchar(64),
                               comment TEXT NOT NULL,
                               reply_to int,
                               created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE post_like (
                           post_id INTEGER,
                           user_id varchar(64),
                           created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE users ADD FOREIGN KEY (id) REFERENCES keycloak (id) ON DELETE CASCADE;

ALTER TABLE users ADD FOREIGN KEY (restriction_id) REFERENCES restrictions (id) ON DELETE SET NULL;

ALTER TABLE restaurants ADD FOREIGN KEY (id) REFERENCES keycloak (id) ON DELETE CASCADE;

ALTER TABLE follows ADD FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE follows ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE;

ALTER TABLE dishes ADD FOREIGN KEY (cuisine_id) REFERENCES cuisines (id) ON DELETE SET NULL;

ALTER TABLE dishes ADD FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE;

ALTER TABLE reviews ADD FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL;

ALTER TABLE reviews ADD FOREIGN KEY (dish_id) REFERENCES dishes (id) ON DELETE CASCADE;

ALTER TABLE posts ADD FOREIGN KEY (author_id) REFERENCES keycloak (id) ON DELETE SET NULL;

ALTER TABLE post_comments ADD FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE;

ALTER TABLE post_comments ADD FOREIGN KEY (author_id) REFERENCES keycloak (id) ON DELETE SET NULL;

ALTER TABLE post_comments ADD FOREIGN KEY (reply_to) REFERENCES post_comments (id) ON DELETE CASCADE;

ALTER TABLE post_like ADD FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE;

ALTER TABLE post_like ADD FOREIGN KEY (user_id) REFERENCES keycloak (id) ON DELETE CASCADE;
