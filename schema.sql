CREATE TABLE "profile_type" (
                                "code" character PRIMARY KEY
);

CREATE TABLE "profiles" (
                            "id" uuid UNIQUE ,
                            "profile_type" character,
                            "tag_name" varchar(64) UNIQUE NOT NULL,
                            "name" varchar(256) NOT NULL,
                            "email" varchar(256) UNIQUE NOT NULL,
                            "phone_number" varchar(12),
                            "avatar_url" varchar(256),
                            "biography" text,
                            "detail_address" varchar(256),
                            "local_address" varchar(256),
                            "lat" float8,
                            "lng" float8,
                            "created_at" timestamp DEFAULT (now()),
                            "updated_at" timestamp DEFAULT (now()),
                            "enable" bool,
                            PRIMARY KEY ("id", "profile_type")
);

CREATE TABLE "users" (
                         "id" uuid PRIMARY KEY,
                         "profile_id" uuid UNIQUE,
                         "dob" date,
                         "created_at" timestamp DEFAULT (now()),
                         "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "restaurants" (
                               "id" uuid PRIMARY KEY,
                               "profile_id" uuid UNIQUE,
                               "operating_hours" varchar(256),
                               "created_at" timestamp DEFAULT (now()),
                               "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "tag" (
                       "id" serial PRIMARY KEY,
                       "tag_type" varchar(64),
                       "image_url" varchar(256),
                       "name" varchar(256) NOT NULL,
                       "slug" varchar(256),
                       "description" text
);

CREATE TABLE "user_tag" (
                            "user_id" uuid NOT NULL,
                            "tag_id" int NOT NULL,
                            PRIMARY KEY ("user_id", "tag_id")
);

CREATE TABLE "restaurant_tag" (
                                  "restaurant_id" uuid NOT NULL,
                                  "tag_id" int NOT NULL,
                                  PRIMARY KEY ("restaurant_id", "tag_id")
);

CREATE TABLE "restaurant_manager" (
                                      "is_owner" bool,
                                      "user_id" uuid,
                                      "restaurant_id" uuid,
                                      PRIMARY KEY ("restaurant_id", "user_id")
);

CREATE TABLE "foods" (
                         "id" uuid PRIMARY KEY,
                         "restaurant_id" uuid,
                         "name" varchar(512) NOT NULL,
                         "description" text,
                         "price" decimal NOT NULL DEFAULT 0,
                         "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "food_tag" (
                            "id" serial PRIMARY KEY,
                            "name" varchar(512),
                            "brief_description" varchar(1024),
                            "tag_id" int,
                            "food_id" uuid
);

CREATE TABLE "reviews" (
                           "id" serial PRIMARY KEY,
                           "restaurant_id" uuid,
                           "content" text,
                           "author" uuid,
                           "rate" integer DEFAULT 5,
                           "created_at" timestamp DEFAULT (now()),
                           "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "food_reviews" (
                                "review_id" integer,
                                "dish_id" uuid,
                                PRIMARY KEY ("review_id", "dish_id")
);

CREATE TABLE "posts" (
                         "id" serial PRIMARY KEY,
                         "author_id" uuid,
                         "checkin_restaurant_id" uuid,
                         "content" text,
                         "created_at" timestamp DEFAULT (now()),
                         "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "post_comments" (
                                 "id" serial PRIMARY KEY,
                                 "ref_to_comment_id" integer,
                                 "post_id" integer,
                                 "author_id" uuid,
                                 "content" text,
                                 "created_at" timestamp DEFAULT (now()),
                                 "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE "profiles" ADD FOREIGN KEY ("id") REFERENCES "users" ("profile_id") ON DELETE SET NULL;

ALTER TABLE "profiles" ADD FOREIGN KEY ("id") REFERENCES "restaurants" ("profile_id") ON DELETE SET NULL;

ALTER TABLE "user_tag" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "user_tag" ADD FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE;

ALTER TABLE "restaurant_tag" ADD FOREIGN KEY ("restaurant_id") REFERENCES "restaurants" ("id") ON DELETE CASCADE;

ALTER TABLE "restaurant_tag" ADD FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE;

ALTER TABLE "restaurant_manager" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "restaurant_manager" ADD FOREIGN KEY ("restaurant_id") REFERENCES "restaurants" ("id") ON DELETE CASCADE;

ALTER TABLE "food_tag" ADD FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE;

ALTER TABLE "food_tag" ADD FOREIGN KEY ("food_id") REFERENCES "foods" ("id") ON DELETE CASCADE;

ALTER TABLE "foods" ADD FOREIGN KEY ("restaurant_id") REFERENCES "restaurants" ("id") ON DELETE CASCADE;

ALTER TABLE "reviews" ADD FOREIGN KEY ("restaurant_id") REFERENCES "restaurants" ("id") ON DELETE CASCADE;

ALTER TABLE "reviews" ADD FOREIGN KEY ("author") REFERENCES "users" ("id") ON DELETE SET NULL;

ALTER TABLE "food_reviews" ADD FOREIGN KEY ("review_id") REFERENCES "reviews" ("id") ON DELETE CASCADE;

ALTER TABLE "food_reviews" ADD FOREIGN KEY ("dish_id") REFERENCES "foods" ("id") ON DELETE SET NULL;

ALTER TABLE "posts" ADD FOREIGN KEY ("checkin_restaurant_id") REFERENCES "restaurants" ("id") ON DELETE SET NULL;

ALTER TABLE "posts" ADD FOREIGN KEY ("author_id") REFERENCES "profiles" ("id") ON DELETE SET NULL;

ALTER TABLE "post_comments" ADD FOREIGN KEY ("author_id") REFERENCES "profiles" ("id") ON DELETE SET NULL;

ALTER TABLE "post_comments" ADD FOREIGN KEY ("ref_to_comment_id") REFERENCES "post_comments" ("id") ON DELETE CASCADE;

ALTER TABLE "post_comments" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id");

ALTER TABLE "profiles" ADD FOREIGN KEY ("profile_type") REFERENCES "profile_type" ("code");
