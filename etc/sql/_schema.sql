-- public.restaurants definition

-- Drop table

-- DROP TABLE restaurants;

CREATE TABLE restaurants (
                             id serial4 NOT NULL,
                             "name" varchar(255) NOT NULL,
                             description text NULL,
                             avatar_url varchar(255) NULL,
                             username varchar(63) NOT NULL,
                             email varchar(127) NULL,
                             phone varchar(63) NULL,
                             address varchar(255) NULL,
                             lat float8 NULL,
                             lng float8 NULL,
                             "document" jsonb NULL,
                             created_at timestamptz DEFAULT now() NULL,
                             updated_at timestamptz DEFAULT now() NULL,
                             is_approved bool DEFAULT false NULL,
                             CONSTRAINT restaurants_email_key UNIQUE (email),
                             CONSTRAINT restaurants_phone_key UNIQUE (phone),
                             CONSTRAINT restaurants_pkey PRIMARY KEY (id),
                             CONSTRAINT restaurants_username_key UNIQUE (username)
);


-- public.users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
                       id bpchar(63) NOT NULL,
                       username varchar(64) NOT NULL,
                       email varchar(127) NOT NULL,
                       display_name varchar(255) NOT NULL,
                       avatar_url varchar(255) NULL,
                       lat float8 NULL,
                       lng float8 NULL,
                       budget int8 NULL,
                       created_at timestamptz DEFAULT now() NULL,
                       updated_at timestamptz DEFAULT now() NULL,
                       CONSTRAINT users_email_key UNIQUE (email),
                       CONSTRAINT users_pkey PRIMARY KEY (id),
                       CONSTRAINT users_username_key UNIQUE (username)
);


-- public.cuisines definition

-- Drop table

-- DROP TABLE cuisines;

CREATE TABLE cuisines (
                          id smallserial NOT NULL,
                          "name" varchar(255) NOT NULL,
                          parent_id int2 NULL,
                          branch_order int4 NOT NULL,
                          image_url varchar(255) NULL,
                          created_at timestamptz DEFAULT now() NULL,
                          updated_at timestamptz DEFAULT now() NULL,
                          CONSTRAINT cuisines_pkey PRIMARY KEY (id),
                          CONSTRAINT cuisines_weight_unique UNIQUE (weight),
                          CONSTRAINT cuisine_parent_id_fk FOREIGN KEY (parent_id) REFERENCES cuisines(id) ON DELETE CASCADE
);


-- public.dishes definition

-- Drop table

-- DROP TABLE dishes;

CREATE TABLE dishes (
                        id serial4 NOT NULL,
                        "name" varchar(255) NOT NULL,
                        description text NULL,
                        price int8 DEFAULT 0 NOT NULL,
                        cuisine_id int2 DEFAULT 0 NOT NULL,
                        restaurant_id int4 NOT NULL,
                        created_at timestamptz DEFAULT now() NULL,
                        updated_at timestamptz DEFAULT now() NULL,
                        CONSTRAINT dish_check_min_price CHECK ((price >= 0)),
                        CONSTRAINT dishes_pkey PRIMARY KEY (id),
                        CONSTRAINT dish_cuisine_id_fk FOREIGN KEY (cuisine_id) REFERENCES cuisines(id) ON DELETE CASCADE,
                        CONSTRAINT dish_restaurant_id_fk FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);


-- public.posts definition

-- Drop table

-- DROP TABLE posts;

CREATE TABLE posts (
                       id bigserial NOT NULL,
                       caption text NULL,
                       created_at timestamptz DEFAULT now() NULL,
                       updated_at timestamptz DEFAULT now() NULL,
                       edit_snapshot jsonb NULL,
                       media jsonb NULL,
                       restaurant_id int4 NULL,
                       CONSTRAINT posts_pkey PRIMARY KEY (id),
                       CONSTRAINT posts_restaurant_id_fk FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);


-- public.posts_comment definition

-- Drop table

-- DROP TABLE posts_comment;

CREATE TABLE posts_comment (
                               id bigserial NOT NULL,
                               post_id int8 NOT NULL,
                               user_id bpchar(63) NOT NULL,
                               reply_to_id int8 NULL,
                               "content" text NULL,
                               media jsonb NULL,
                               CONSTRAINT posts_comment_pkey PRIMARY KEY (id),
                               CONSTRAINT post_comment_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                               CONSTRAINT posts_comment_post_id_fk FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                               CONSTRAINT posts_comment_reply_to_id_fk FOREIGN KEY (reply_to_id) REFERENCES posts_comment(id) ON DELETE CASCADE
);


-- public.restaurant_manager definition

-- Drop table

-- DROP TABLE restaurant_manager;

CREATE TABLE restaurant_manager (
                                    user_id bpchar(63) NOT NULL,
                                    restaurant_id int4 NOT NULL,
                                    is_owner bool DEFAULT false NULL,
                                    created_at timestamptz DEFAULT now() NULL,
                                    updated_at timestamptz DEFAULT now() NULL,
                                    CONSTRAINT restaurant_manager_pkey PRIMARY KEY (user_id, restaurant_id),
                                    CONSTRAINT restaurant_manager_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
                                    CONSTRAINT restaurant_manager_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- public.reviews definition

-- Drop table

-- DROP TABLE reviews;

CREATE TABLE reviews (
                         id bigserial NOT NULL,
                         rating int2 NOT NULL,
                         "comment" text NOT NULL,
                         created_at timestamptz DEFAULT now() NULL,
                         user_id bpchar(63) NOT NULL,
                         dish_id int4 NOT NULL,
                         updated_at timestamptz DEFAULT now() NULL,
                         CONSTRAINT reviews_check_valid_rating CHECK (((rating > 0) AND (rating <= 10))),
                         CONSTRAINT reviews_pkey PRIMARY KEY (id),
                         CONSTRAINT reviews_dish_id FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
                         CONSTRAINT reviews_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- public.user_cuisine definition

-- Drop table

-- DROP TABLE user_cuisine;

CREATE TABLE user_cuisine (
                              user_id bpchar(63) NOT NULL,
                              cuisine_id int2 NOT NULL,
                              created_at timestamptz DEFAULT now() NULL,
                              updated_at timestamptz DEFAULT now() NULL,
                              CONSTRAINT user_cuisine_pkey PRIMARY KEY (user_id, cuisine_id),
                              CONSTRAINT user_cuisine_cuisine_id FOREIGN KEY (cuisine_id) REFERENCES cuisines(id) ON DELETE CASCADE,
                              CONSTRAINT user_cuisine_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- public.user_interactions definition

-- Drop table

-- DROP TABLE user_interactions;

CREATE TABLE user_interactions (
                                   id serial4 NOT NULL,
                                   user_id bpchar(63) NULL,
                                   dish_id int4 NOT NULL,
                                   interaction_score int2 DEFAULT 1 NULL,
                                   created_at timestamptz DEFAULT now() NULL,
                                   CONSTRAINT user_interactions_pkey PRIMARY KEY (id),
                                   CONSTRAINT user_interactions_dish_id_fk FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
                                   CONSTRAINT user_interactions_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);


-- public.user_recommendation definition

-- Drop table

-- DROP TABLE user_recommendation;

CREATE TABLE user_recommendation (
                                     id bigserial NOT NULL,
                                     user_id bpchar(63) NULL,
                                     dish_id int4 NOT NULL,
                                     score float8 NOT NULL,
                                     created_at timestamptz DEFAULT now() NULL,
                                     CONSTRAINT user_recommendation_pkey PRIMARY KEY (id),
                                     CONSTRAINT user_recommendation_dish_id_fk FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
                                     CONSTRAINT user_recommendation_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- public.post_like definition

-- Drop table

-- DROP TABLE post_like;

CREATE TABLE post_like (
                           post_id int8 NOT NULL,
                           user_id bpchar(63) NOT NULL,
                           created_at timestamptz DEFAULT now() NULL,
                           CONSTRAINT post_like_pkey PRIMARY KEY (post_id, user_id),
                           CONSTRAINT post_like_post_id_fk FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                           CONSTRAINT post_like_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);