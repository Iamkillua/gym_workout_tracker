CREATE TYPE "public"."workout_type" AS ENUM('STRENGTH', 'BODYWEIGHT', 'TREADMILL', 'CYCLING');--> statement-breakpoint
CREATE TABLE "profile_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"age" integer NOT NULL,
	"height_cm" double precision NOT NULL,
	"weight_kg" double precision NOT NULL,
	"bmi" double precision NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(30) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "workout_type" NOT NULL,
	"name" varchar(80) NOT NULL,
	"performed_on" date DEFAULT CURRENT_DATE NOT NULL,
	"weight_kg" double precision,
	"reps" integer,
	"sets" integer,
	"duration_minutes" double precision,
	"steps" integer,
	"calories" integer,
	"distance_km" double precision,
	"average_speed_kmh" double precision,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_entries" ADD CONSTRAINT "profile_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profile_entries_user_date_idx" ON "profile_entries" USING btree ("user_id","recorded_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "workouts_user_date_idx" ON "workouts" USING btree ("user_id","performed_on");--> statement-breakpoint
CREATE INDEX "workouts_user_name_type_idx" ON "workouts" USING btree ("user_id","name","type");