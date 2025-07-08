-- public.restaurants definition

-- Drop table

-- DROP TABLE public.restaurants;

CREATE TABLE public.restaurants (
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
                                    open_hour varchar(200) NULL,
                                    website varchar(500) NULL,
                                    cover_url varchar(500) NULL,
                                    CONSTRAINT restaurants_email_key UNIQUE (email),
                                    CONSTRAINT restaurants_phone_key UNIQUE (phone),
                                    CONSTRAINT restaurants_pkey PRIMARY KEY (id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
                              id varchar(64) NOT NULL,
                              username varchar(64) NOT NULL,
                              email varchar(127) NOT NULL,
                              display_name varchar(255) NOT NULL,
                              avatar_url varchar(255) NULL,
                              lat float8 NULL,
                              lng float8 NULL,
                              budget int8 NULL,
                              created_at timestamptz DEFAULT now() NULL,
                              updated_at timestamptz DEFAULT now() NULL,
                              "enable" bool DEFAULT true NOT NULL,
                              CONSTRAINT users_email_key UNIQUE (email),
                              CONSTRAINT users_pkey PRIMARY KEY (id),
                              CONSTRAINT users_username_key UNIQUE (username)
);


-- public.cuisines definition

-- Drop table

-- DROP TABLE public.cuisines;

CREATE TABLE public.cuisines (
                                 id smallserial NOT NULL,
                                 "name" varchar(255) NOT NULL,
                                 parent_id int2 NULL,
                                 image_url varchar(255) NULL,
                                 created_at timestamptz DEFAULT now() NULL,
                                 updated_at timestamptz DEFAULT now() NULL,
                                 CONSTRAINT cuisines_pkey PRIMARY KEY (id),
                                 CONSTRAINT cuisine_parent_id_fk FOREIGN KEY (parent_id) REFERENCES public.cuisines(id) ON DELETE CASCADE
);


-- public.dishes definition

-- Drop table

-- DROP TABLE public.dishes;

CREATE TABLE public.dishes (
                               id serial4 NOT NULL,
                               "name" varchar(255) NOT NULL,
                               description text NULL,
                               price int8 DEFAULT 0 NOT NULL,
                               cuisine_id int2 DEFAULT 0 NOT NULL,
                               restaurant_id int4 NOT NULL,
                               created_at timestamptz DEFAULT now() NULL,
                               updated_at timestamptz DEFAULT now() NULL,
                               images varchar(200) DEFAULT '[]'::jsonb NULL,
                               "urlName" varchar(200) NULL,
                               CONSTRAINT "UQ_dishes_urlName" UNIQUE ("urlName"),
                               CONSTRAINT dish_check_min_price CHECK ((price >= 0)),
                               CONSTRAINT dishes_pkey PRIMARY KEY (id),
                               CONSTRAINT dish_cuisine_id_fk FOREIGN KEY (cuisine_id) REFERENCES public.cuisines(id) ON DELETE CASCADE,
                               CONSTRAINT dish_restaurant_id_fk FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE
);


-- public.posts definition

-- Drop table

-- DROP TABLE public.posts;

CREATE TABLE public.posts (
                              id bigserial NOT NULL,
                              caption text NULL,
                              created_at timestamptz DEFAULT now() NULL,
                              updated_at timestamptz DEFAULT now() NULL,
                              edit_snapshot jsonb NULL,
                              media _text NULL,
                              restaurant_id int4 NULL,
                              CONSTRAINT posts_pkey PRIMARY KEY (id),
                              CONSTRAINT posts_restaurant_id_fk FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE
);


-- public.posts_comment definition

-- Drop table

-- DROP TABLE public.posts_comment;

CREATE TABLE public.posts_comment (
                                      id bigserial NOT NULL,
                                      post_id int8 NOT NULL,
                                      user_id bpchar(63) NOT NULL,
                                      reply_to_id int8 NULL,
                                      "content" text NULL,
                                      media jsonb NULL,
                                      CONSTRAINT posts_comment_pkey PRIMARY KEY (id),
                                      CONSTRAINT post_comment_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL,
                                      CONSTRAINT posts_comment_post_id_fk FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE,
                                      CONSTRAINT posts_comment_reply_to_id_fk FOREIGN KEY (reply_to_id) REFERENCES public.posts_comment(id) ON DELETE CASCADE
);


-- public.restaurant_manager definition

-- Drop table

-- DROP TABLE public.restaurant_manager;

CREATE TABLE public.restaurant_manager (
                                           user_id varchar(64) NOT NULL,
                                           restaurant_id int4 NOT NULL,
                                           is_owner bool DEFAULT false NULL,
                                           created_at timestamptz DEFAULT now() NULL,
                                           updated_at timestamptz DEFAULT now() NULL,
                                           CONSTRAINT restaurant_manager_pkey PRIMARY KEY (user_id, restaurant_id),
                                           CONSTRAINT restaurant_manager_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE,
                                           CONSTRAINT restaurant_manager_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.reviews definition

-- Drop table

-- DROP TABLE public.reviews;

CREATE TABLE public.reviews (
                                id bigserial NOT NULL,
                                rating int2 NOT NULL,
                                "comment" text NOT NULL,
                                created_at timestamptz DEFAULT now() NULL,
                                user_id varchar(64) NOT NULL,
                                dish_id int4 NOT NULL,
                                updated_at timestamptz DEFAULT now() NULL,
                                CONSTRAINT reviews_check_valid_rating CHECK (((rating > 0) AND (rating <= 10))),
                                CONSTRAINT reviews_pkey PRIMARY KEY (id),
                                CONSTRAINT reviews_dish_id FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON DELETE CASCADE,
                                CONSTRAINT reviews_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.ssfcm_logs definition

-- Drop table

-- DROP TABLE public.ssfcm_logs;

CREATE TABLE public.ssfcm_logs (
                                   id serial4 NOT NULL,
                                   created_at timestamptz NULL,
                                   user_id varchar(64) NOT NULL,
                                   evaluation jsonb NULL,
                                   process_duration int8 NULL,
                                   number_cluster int4 NULL,
                                   memberships _float8 NULL,
                                   status int2 DEFAULT 0 NOT NULL,
                                   centroids _float8 NULL,
                                   iteration int4 DEFAULT 0 NULL,
                                   CONSTRAINT "PK_ssfcm_logs" PRIMARY KEY (id),
                                   CONSTRAINT "FK_ssfcm_logs_user_id" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL ON UPDATE SET NULL
);


-- public.user_cuisine definition

-- Drop table

-- DROP TABLE public.user_cuisine;

CREATE TABLE public.user_cuisine (
                                     user_id varchar(63) NOT NULL,
                                     cuisine_id int2 NOT NULL,
                                     created_at timestamptz DEFAULT now() NULL,
                                     updated_at timestamptz DEFAULT now() NULL,
                                     CONSTRAINT user_cuisine_pkey PRIMARY KEY (user_id, cuisine_id),
                                     CONSTRAINT user_cuisine_cuisine_id FOREIGN KEY (cuisine_id) REFERENCES public.cuisines(id) ON DELETE CASCADE,
                                     CONSTRAINT user_cuisine_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.user_interactions definition

-- Drop table

-- DROP TABLE public.user_interactions;

CREATE TABLE public.user_interactions (
                                          id serial4 NOT NULL,
                                          user_id varchar(64) NULL,
                                          dish_id int4 NOT NULL,
                                          interaction_score int2 DEFAULT 1 NULL,
                                          created_at timestamptz DEFAULT now() NULL,
                                          CONSTRAINT user_interactions_pkey PRIMARY KEY (id),
                                          CONSTRAINT user_interactions_dish_id_fk FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON DELETE CASCADE,
                                          CONSTRAINT user_interactions_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);


-- public.user_recommendation definition

-- Drop table

-- DROP TABLE public.user_recommendation;

CREATE TABLE public.user_recommendation (
                                            id bigserial NOT NULL,
                                            user_id varchar(63) NULL,
                                            dish_id int4 NOT NULL,
                                            score float8 NOT NULL,
                                            log_id int8 NULL,
                                            CONSTRAINT user_recommendation_pkey PRIMARY KEY (id),
                                            CONSTRAINT user_recommendation_dish_id_fk FOREIGN KEY (dish_id) REFERENCES public.dishes(id) ON DELETE CASCADE,
                                            CONSTRAINT user_recommendation_ssfcm_logs_fk FOREIGN KEY (log_id) REFERENCES public.ssfcm_logs(id) ON DELETE CASCADE,
                                            CONSTRAINT user_recommendation_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.user_restaurant_follow definition

-- Drop table

-- DROP TABLE public.user_restaurant_follow;

CREATE TABLE public.user_restaurant_follow (
                                               user_id varchar(63) NOT NULL,
                                               restaurant_id int4 NOT NULL,
                                               created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
                                               CONSTRAINT user_restaurant_follow_pkey PRIMARY KEY (user_id, restaurant_id),
                                               CONSTRAINT user_restaurant_follow_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id),
                                               CONSTRAINT user_restaurant_follow_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);


-- public.post_like definition

-- Drop table

-- DROP TABLE public.post_like;

CREATE TABLE public.post_like (
                                  post_id int8 NOT NULL,
                                  user_id bpchar(63) NOT NULL,
                                  created_at timestamptz DEFAULT now() NULL,
                                  CONSTRAINT post_like_pkey PRIMARY KEY (post_id, user_id),
                                  CONSTRAINT post_like_post_id_fk FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE,
                                  CONSTRAINT post_like_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL
);