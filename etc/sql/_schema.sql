CREATE TABLE "public"."cuisines" (
                                     "id" SERIAL,
                                     "name" VARCHAR(255) NOT NULL,
                                     "parent_id" SMALLINT NULL,
                                     "image_url" VARCHAR(255) NULL,
                                     "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                     "updated_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                     CONSTRAINT "cuisines_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."users" (
                                  "id" VARCHAR(64) NOT NULL,
                                  "username" VARCHAR(64) NOT NULL,
                                  "email" VARCHAR(127) NOT NULL,
                                  "display_name" VARCHAR(255) NOT NULL,
                                  "avatar_url" VARCHAR(255) NULL,
                                  "lat" DOUBLE PRECISION NULL,
                                  "lng" DOUBLE PRECISION NULL,
                                  "budget" BIGINT NULL,
                                  "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                  "updated_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                  "enable" BOOLEAN NOT NULL DEFAULT true ,
                                  CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
                                  CONSTRAINT "users_username_key" UNIQUE ("username"),
                                  CONSTRAINT "users_email_key" UNIQUE ("email")
);
CREATE TABLE "public"."user_cuisine" (
                                         "user_id" VARCHAR(63) NOT NULL,
                                         "cuisine_id" SMALLINT NOT NULL,
                                         "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                         "updated_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                         CONSTRAINT "user_cuisine_pkey" PRIMARY KEY ("user_id", "cuisine_id")
);
CREATE TABLE "public"."restaurants" (
                                        "id" SERIAL,
                                        "name" VARCHAR(255) NOT NULL,
                                        "description" TEXT NULL,
                                        "avatar_url" VARCHAR(255) NULL,
                                        "username" VARCHAR(63) NOT NULL,
                                        "email" VARCHAR(127) NULL,
                                        "phone" VARCHAR(63) NULL,
                                        "address" VARCHAR(255) NULL,
                                        "lat" DOUBLE PRECISION NULL,
                                        "lng" DOUBLE PRECISION NULL,
                                        "document" JSONB NULL,
                                        "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                        "updated_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                        "is_approved" BOOLEAN NULL DEFAULT false ,
                                        "open_hour" VARCHAR(200) NULL,
                                        "website" VARCHAR(500) NULL,
                                        "cover_url" VARCHAR(500) NULL,
                                        CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id"),
                                        CONSTRAINT "restaurants_username_key" UNIQUE ("username"),
                                        CONSTRAINT "restaurants_email_key" UNIQUE ("email"),
                                        CONSTRAINT "restaurants_phone_key" UNIQUE ("phone")
);
CREATE TABLE "public"."posts" (
                                  "id" SERIAL,
                                  "caption" TEXT NULL,
                                  "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                  "updated_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                  "edit_snapshot" JSONB NULL,
                                  "media" JSONB NULL,
                                  "restaurant_id" INTEGER NULL,
                                  CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."restaurant_manager" (
                                               "user_id" VARCHAR(64) NOT NULL,
                                               "restaurant_id" INTEGER NOT NULL,
                                               "is_owner" BOOLEAN NULL DEFAULT false ,
                                               "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                               "updated_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                               CONSTRAINT "restaurant_manager_pkey" PRIMARY KEY ("user_id", "restaurant_id")
);
CREATE TABLE "public"."reviews" (
                                    "id" SERIAL,
                                    "rating" SMALLINT NOT NULL,
                                    "comment" TEXT NOT NULL,
                                    "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                    "user_id" VARCHAR(64) NOT NULL,
                                    "dish_id" INTEGER NOT NULL,
                                    "updated_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."dishes" (
                                   "id" SERIAL,
                                   "name" VARCHAR(255) NOT NULL,
                                   "description" TEXT NULL,
                                   "price" BIGINT NOT NULL DEFAULT 0 ,
                                   "cuisine_id" SMALLINT NOT NULL DEFAULT 0 ,
                                   "restaurant_id" INTEGER NOT NULL,
                                   "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                   "updated_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                   "images" JSONB NULL DEFAULT '[]'::jsonb ,
                                   CONSTRAINT "dishes_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."posts_comment" (
                                          "id" SERIAL,
                                          "post_id" BIGINT NOT NULL,
                                          "user_id" CHARACTER(63) NOT NULL,
                                          "reply_to_id" BIGINT NULL,
                                          "content" TEXT NULL,
                                          "media" JSONB NULL,
                                          CONSTRAINT "posts_comment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."post_like" (
                                      "post_id" BIGINT NOT NULL,
                                      "user_id" CHARACTER(63) NOT NULL,
                                      "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                      CONSTRAINT "post_like_pkey" PRIMARY KEY ("post_id", "user_id")
);
CREATE TABLE "public"."user_interactions" (
                                              "id" SERIAL,
                                              "user_id" VARCHAR(64) NULL,
                                              "dish_id" INTEGER NOT NULL,
                                              "interaction_score" SMALLINT NULL DEFAULT 1 ,
                                              "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                              CONSTRAINT "user_interactions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."user_recommendation" (
                                                "id" SERIAL,
                                                "user_id" VARCHAR(63) NULL,
                                                "dish_id" INTEGER NOT NULL,
                                                "score" DOUBLE PRECISION NOT NULL,
                                                "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT now() ,
                                                CONSTRAINT "user_recommendation_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "public"."user_restaurant_follow" (
                                                   "user_id" VARCHAR(63) NOT NULL,
                                                   "restaurant_id" INTEGER NOT NULL,
                                                   "created_at" TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP ,
                                                   CONSTRAINT "user_restaurant_follow_pkey" PRIMARY KEY ("user_id", "restaurant_id")
);
ALTER TABLE "public"."cuisines" ADD CONSTRAINT "cuisine_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cuisines" ("id");
ALTER TABLE "public"."user_cuisine" ADD CONSTRAINT "user_cuisine_cuisine_id" FOREIGN KEY ("cuisine_id") REFERENCES "public"."cuisines" ("id");
ALTER TABLE "public"."user_cuisine" ADD CONSTRAINT "user_cuisine_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id");
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_restaurant_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants" ("id");
ALTER TABLE "public"."restaurant_manager" ADD CONSTRAINT "restaurant_manager_restaurant_id" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants" ("id");
ALTER TABLE "public"."restaurant_manager" ADD CONSTRAINT "restaurant_manager_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id");
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_dish_id" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes" ("id");
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id");
ALTER TABLE "public"."dishes" ADD CONSTRAINT "dish_cuisine_id_fk" FOREIGN KEY ("cuisine_id") REFERENCES "public"."cuisines" ("id");
ALTER TABLE "public"."dishes" ADD CONSTRAINT "dish_restaurant_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants" ("id");
ALTER TABLE "public"."posts_comment" ADD CONSTRAINT "posts_comment_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts" ("id");
ALTER TABLE "public"."posts_comment" ADD CONSTRAINT "posts_comment_reply_to_id_fk" FOREIGN KEY ("reply_to_id") REFERENCES "public"."posts_comment" ("id");
ALTER TABLE "public"."posts_comment" ADD CONSTRAINT "post_comment_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id");
ALTER TABLE "public"."post_like" ADD CONSTRAINT "post_like_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts" ("id");
ALTER TABLE "public"."post_like" ADD CONSTRAINT "post_like_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id");
ALTER TABLE "public"."user_interactions" ADD CONSTRAINT "user_interactions_dish_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes" ("id");
ALTER TABLE "public"."user_interactions" ADD CONSTRAINT "user_interactions_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id");
ALTER TABLE "public"."user_recommendation" ADD CONSTRAINT "user_recommendation_dish_id_fk" FOREIGN KEY ("dish_id") REFERENCES "public"."dishes" ("id");
ALTER TABLE "public"."user_recommendation" ADD CONSTRAINT "user_recommendation_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id");
ALTER TABLE "public"."user_restaurant_follow" ADD CONSTRAINT "user_restaurant_follow_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants" ("id");
ALTER TABLE "public"."user_restaurant_follow" ADD CONSTRAINT "user_restaurant_follow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id");
